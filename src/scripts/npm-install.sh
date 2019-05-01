ALL_MOD_DIR=$(ls --ignore={scripts,test} -h src/)

printf "Iteratively NPM installing module dependencies..."

for MOD_DIR in $ALL_MOD_DIR
do
  cd ./src/$MOD_DIR
  printf "\n\nCurrently at: $(pwd)"

  if [ -f "package.json" ]; then
    printf "\n\nNPM installing module dependencies..."
    npm i --quiet
    printf "Module dependencies installed."
  fi

  cd ../..
done

printf "\n\nDependencies of all modules installed."
