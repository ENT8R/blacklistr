# [blacklistr](https://ent8r.github.io/blacklistr/)

[blacklistr](https://ent8r.github.io/blacklistr/) is a tool for visualizing in which countries a specific feature exists or doesn't exist

### Getting started

To change the state of a country from disabled to enabled (or the other way round), you have two options:

1. click on the country you want to be disabled or enabled and you will see that there will automatically will be a new country code on the right side
2. type in the single country codes in the editor on the right side and the map will update instantly

All country codes should be a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code or for some countries like the USA, China or India even a [ISO_3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code

### API

#### Load data from a string

To load the data from a string use the endpoint `/?data={data}`

Example: [`/?data=all except "NL", "DK", "NO", "CZ", "IT"`](https://ent8r.github.io/blacklistr/?data=all%20except%0A%22NL%22,%20%22DK%22,%20%22NO%22,%20%22CZ%22,%20%22IT%22)

#### Load data from a file

To load the data from a file use the endpoint `/?file={file_name}`

Example: [`/?file=https://ent8r.github.io/blacklistr/assets/test.json`](https://ent8r.github.io/blacklistr/?file=https://ent8r.github.io/blacklistr/assets/test.json)

#### Load StreetComplete data

To load the data used by [StreetComplete](https://github.com/streetcomplete/StreetComplete/) use the endpoint `/?streetcomplete={questDirectory/questName}`

Example: [`/?streetcomplete=address/AddHousenumber.kt`](https://ent8r.github.io/blacklistr/?streetcomplete=address/AddHousenumber.kt)

### Found an issue?
- Just report it in the [issue section](https://github.com/ENT8R/blacklistr/issues/) of this repository
