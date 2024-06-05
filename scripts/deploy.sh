source ~/startup.sh
WORKPLACE="$HOME/workplace/StreamsWebPocs"

WORKSPACE="$WORKPLACE/StreamsWebPocsApp"
(
  cd "$WORKSPACE"
  rsync-project StreamsWebPocs
  ssh root@hetzner "cd ~/workplace/StreamsWebPocs/StreamsWebPocsApp && npm run build"
)
