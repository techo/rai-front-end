# Mapa de Asentamientos Informales - Techo

## Configuration
You have to set your mapbox uris:
```javascript
var mapboxURI = "https://api.mapbox.com/styles/v1/username...";
var mapboxSatellitalURI = "https://api.mapbox.com/styles/v1/username...";
```

Next, set the data API endpoint:
```javascript
var api_base = env == "DEV" ? "your_development_api_endpoint" : "your_production_api_endpoint";
```

## Run project
You need docker and docker compose before running this project.

```bash
$ docker-compose up -d
```
Now open [http://localhost:8080](http://localhost:8080) in your browser.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/techo/rai-front-end. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

This project is available as open source under the terms of the [GPLv3 License](LICENSE).
