#! /bin/sh
IPV6_ADDRESS=2a02:8070:4ad:eaa0:4fc6:e7b5:6879:2eff
# incoming http port on EC2 instance
SOURCE_HTTP_PORT=8080
# incoming http port on RPi
TARGET_HTTP_PORT=80
# incoming https port on EC2 instance
SOURCE_HTTPS_PORT=8443
# incoming https port on RPi
TARGET_HTTPS_PORT=443
# incoming ssh port on EC2 instance to forward to RPi
SOURCE_SSH_PORT=8022
# incoming ssh port on RPi
TARGET_SSH_PORT=22
# 6tunnel http command
HTTP_6TUNNEL_COMMAND="/usr/bin/6tunnel $SOURCE_HTTP_PORT $IPV6_ADDRESS $TARGET_HTTP_PORT"
# 6tunnel https command
HTTPS_6TUNNEL_COMMAND="/usr/bin/6tunnel $SOURCE_HTTPS_PORT $IPV6_ADDRESS $TARGET_HTTPS_PORT"
# 6tunnel ssh command
SSH_6TUNNEL_COMMAND="/usr/bin/6tunnel $SOURCE_SSH_PORT $IPV6_ADDRESS $TARGET_SSH_PORT"

$HTTP_6TUNNEL_COMMAND && $HTTPS_6TUNNEL_COMMAND && $SSH_6TUNNEL_COMMAND