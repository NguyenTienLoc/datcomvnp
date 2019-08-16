#!/bin/bash

cd "$(dirname "$0")"

VPS_IP=209.97.163.237
VPS_PORT=22
VPS_USERNAME=mermaid

# upload to vps
rsync -avz --delete \
-e "ssh -p $VPS_PORT" \
--exclude=.* \
--exclude=node_modules \
.. "$VPS_USERNAME@$VPS_IP":~/Projects/Javascript/datcom