in=$(wildcard *.md)
out=$(in:%.md=%.html)

all: $(out)

%.html: %.md
	./build/Markdown.pl < $^ > $@.tmp
	./build/decorate.sh $(@:%.html=%) < $@.tmp > $@
	rm -f -- $@.tmp

clean:
	rm -f -- *.html *.tmp
