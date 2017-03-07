#!/bin/bash
SUS="Sudoku/server"
SUC="Sudoku/client"
SCS="Scrabble/server"
SCC="Scrabble/client"
CUS="Curling/server"
CUC="Curling/client"
MOD=""

if [ "$1" = "--dry-run" -o "$1" = "--silent" ]
then
  MOD="$1"
  echo "Running script with option "$1
  if [ "$2" = "--dry-run" -o "$2" = "--silent" ]
  then
    MOD="$1 $2"
    echo "Running script with 2nd option "$2
  fi
fi

echo "Checking if directory structure is good..."
if [ -d $SUS -a -d $SUC -a -d $SCS -a -d $SCC -a -d $CUS -a -d $CUC ]
then
  echo "Directory structure is good, beginning npm install task..."
  cd Sudoku/server
  if [ "$1" = "--clean" ]
  then
    echo "Cleanup old modules..."
    rm -rf node_modules
    echo "Success."
  fi
  echo "Installing Sudoku server modules..."
  npm install $MOD
  echo "Sudoku server modules installed."
  cd ../client
  if [ "$1" = "--clean" ]
  then
    echo "Cleanup old modules..."
    rm -rf node_modules
    echo "Success."
  fi
  echo "Installing Sudoku client modules..."
  npm install $MOD
  echo "Sudoku client modules installed."
  cd ../../Scrabble/server
  if [ "$1" = "--clean" ]
  then
    echo "Cleanup old modules..."
    rm -rf node_modules
    echo "Success."
  fi
  echo "Installing Scrabble server modules..."
  npm install $MOD
  echo "Scrabble server modules installed."
  cd ../client
  if [ "$1" = "--clean" ]
  then
    echo "Cleanup old modules..."
    rm -rf node_modules
    echo "Success."
  fi
  echo "Installing Scrabble client modules..."
  npm install $MOD
  echo "Scrabble client modules installed."
  cd ../../Curling/server
  if [ "$1" = "--clean" ]
  then
    echo "Cleanup old modules..."
    rm -rf node_modules
    echo "Success."
  fi
  echo "Installing Curling server modules..."
  npm install $MOD
  echo "Curling server modules installed."
  cd ../client
  if [ "$1" = "--clean" ]
  then
    echo "Cleanup old modules..."
    rm -rf node_modules
    echo "Success."
  fi
  echo "Installing Curling client modules..."
  npm install $MOD
  echo "Curling client modules installed."
  cd ..
  echo "NPM Install done!"
else
  echo "Directory structure is wrong! Check if all directories are at the right place."
fi
