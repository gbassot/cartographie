deploy: ## deploy to github pahes
	ng build --prod --base-href "https://gbassot.github.io/cartographie/"
	npx angular-cli-ghpages --dir=dist/angular-cartographie
