MOCHA = ./node_modules/.bin/_mocha
ESLINT = ./node_modules/.bin/eslint
ISTANBUL = ./node_modules/.bin/istanbul
COVERALLS = ./node_modules/coveralls/bin/coveralls.js

clean:
	@rm -rf node_modules

install:
	@npm install --registry=http://registry.npm.taobao.org/

lint: install
	@$(ESLINT) ./lib/ ./test/ ./examples/ ./nbt.js

test: install
	@$(MOCHA)

test-cov: install
	@$(ISTANBUL) cover $(MOCHA) \
		--report lcovonly \
		-- \
		-R spec

clean-cov:
	@rm -rf ./coverage

.PHONY: test clean clean-cov
