# Requirements

- AWS account

# Part 1: AWS CloudFormation

1. Create an EC2 key-pair,

   - required for ssh access into the EC2 that will be created: https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#KeyPairs

2. Run `chmod 400 4in6tunnel.pem` on the stored key file (update file name)
3. Go to CloudFormation

   - https://eu-west-1.console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks?filteringStatus=active&filteringText=&viewNested=true&hideStacks=false

4. Copy paste the stack.json and create the stack in CloudFormation
5. Navigate to the EC2 services

   - https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Instances

6. Copy the Public IPv4 DNS

   - e.g. ec2-18-203-30-246.eu-west-1.compute.amazonaws.com

7. Open the terminal an SSH into the server using the ubuntu username and the key you generated in step 1

   - e.g. ssh -i "ipForwardTest.pem" ubuntu@ec2-54-74-193-16.eu-west-1.compute.amazonaws.com

# [Optional] Part 2: Setup node & test the server reachability

1. Setup Node Version Manager

   - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`

2. Activate the Node Version Manager

   - `. ~/.nvm/nvm.sh`

3. Install Node

   - `nvm install node`

4. Create a test directory on the EC2 server

   - `git clone https://github.com/ResoluteError/4in6tunnel.git`

5. Setup test project

   - `cd 4in6tunnel/expressHelloWorld`
   - `npm install`

6. Run the test express app to respond on port 8080

   - `node index.js`

7. In your aws console, get the "Public IPv4 address" & "IPv6 IPs" of your EC2 instance
8. Visit the IPs on the 8080 port

   - `http://18.203.30.246:8080`
   - `http://[2a05:d018:a60:1f00:ea4b:72ae:8e81:390d]:8080` (don't forget the braces)

9. If you see the "Hello World" message, you are ready to go.

# Part 3: Setup port-forwarding & 6tunnel

1. Setup the IPTables to map port 80 to 8080 and 443 to 8443 on the EC2 instance

   - sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
   - sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443

2. Persist the IPTables to remain active after reboots

   - `sudo apt-get update`
   - `sudo apt-get install iptables-persistent` (Say yes to all options)
   - _Optional:_ If you created the node script, make sure it is running (`node index.js`) and check if you get the expected "Hello World" response from the IPv4 and IPv6 addresses without any port information (defaults to 80)

_Before you continue, make sure port 8080 and 8443 are freed up again by stopping the node script_

3. Install 6tunnel

   - `sudo apt-get install 6tunnel`

4. Identify the IPv6 address of your raspberryPi

   - e.g. `2a02:8070:4ad:eaa0:4fc6:e7b5:6879:2eff`

5. Create the 6tunnel setup script

   - run `nano /home/ubuntu/6tunnel-setup.sh`
   - copy/paste the contents of `./serverSetup/6tunnel-setup.sh`
   - **IMPORTANT:** replace the IPV6_ADDRESS in line 2 with the IPv6 from the previous step
   - run `chmod 755 /home/ubuntu/6tunnel-setup.sh`

6. Run the setup script and test the url to make sure the tunnel is working

   - run `/home/ubuntu/6tunnel-setup.sh`
   - visit the public IPv4 of your EC2 instance in your browser

7. Add daemon to run the setup script on reboot

   - run `sudo nano /etc/systemd/system/6tunnel.service`
   - copy/paste the contents of `./serverSetup/6tunnel.service`
   - run `sudo chmod 755 /etc/systemd/system/6tunnel.service`
   - run `sudo systemctl daemon-reload && sudo systemctl enable 6tunnel`

# [Optional] Part 4: Setup Domain DNS

1. Go to your domain provider (e.g. Route53 on AWS or UnitedDomains or Strato)

2. Set the A record to point to the public IPv4 of your **EC2 instance**

3. Set the AAAA record to point to the public IPv6 of your **RaspberryPi**

4. Wait for the records to activate and test
