#!/bin/bash

function warning () {
  fg_color=1 # red
  echo "$(tput bold)$(tput setaf $fg_color)WARNING: $@$(tput sgr0)"
}

pdflatex cv.tex || warning "pdflatex failed!"
rm -f cv.log

rm -f cv.html
docker run -ti --rm -v $(pwd .):/pdf bwits/pdf2htmlex pdf2htmlEX --zoom 1.3 cv.pdf || warning "pdf2htmlEX failed!"
