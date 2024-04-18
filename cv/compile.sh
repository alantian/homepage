#!/bin/bash

set -u
set -o pipefail

function warning () {
  fg_color=1 # red
  echo "$(tput bold)$(tput setaf $fg_color)WARNING: $@$(tput sgr0)"
}

function compile(){
  FILENAME="${1:-cv}"
  shift

  pdflatex "$FILENAME.tex" || warning "pdflatex failed!"
  rm -f "$FILENAME.log"
  rm -f "$FILENAME.html"
  docker run -ti --rm -v $(pwd .):/pdf bwits/pdf2htmlex pdf2htmlEX --zoom 1.3 "$FILENAME.pdf" || warning "pdf2htmlEX failed!"
}


compile "$@"