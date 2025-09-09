#!/bin/sh
hostport="$1"
shift
cmd="$@"

echo "Checking $hostport..."
while ! nc -z $(echo $hostport | sed 's/:/ /'); do
  echo "Waiting for $hostport..."
  sleep 2
done

echo "$hostport is up - executing command"
sh -c "$cmd"
