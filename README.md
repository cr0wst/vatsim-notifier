# VATSIM Notifier

This project scrapes the [VATSIM Data endpoint](https://data.vatsim.net/) for controller data and stores it in a
database.

It then sends notifications to a Discord channel when a controller logs on or off.

The current data is exposed via an API as well as providing an interface for configuring which facilities to be notified
about.