in=$(wildcard *.md)
out=$(in:%.md=%.html)

all: $(out)

%.html: %.md
	@echo -e "  [BUILD]  $@"
	@./build/Markdown.pl < $^ > $@.tmp
	@./build/decorate.sh $$(./build/get-title.pl < $^) < $@.tmp > $@
	@rm -f -- $@.tmp

clean:
	rm -f -- *.html *.tmp
