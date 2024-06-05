WORKPLACE="$HOME/workplace/StreamsWebPocs"

WORKSPACE="$WORKPLACE/StreamsWebPocsApi"

(
  cd "$WORKSPACE"
  ./scripts/gen.sh
)

WORKSPACE="$WORKPLACE/StreamsWebPocsApp"
SCHEMA_PATH="$WORKPLACE/StreamsWebPocsApi/api/openapi.yaml"

(
  cd "$WORKSPACE"
  rm -rf openapi-client
  npx openapi -i "$SCHEMA_PATH" -o openapi-client
)
