// ── AD MAKER ──
var amLogoDataUrl = null;
var CTAX_LOGO_WHITE = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjUwNi4zMyAyNzAuMzMiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTMpOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTIpOwogICAgICB9CgogICAgICAuY2xzLTMgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50KTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjZTJlY2VmOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHgxPSIxOS4yMiIgeTE9Ii4wNCIgeDI9IjIwNi42NCIgeTI9IjE4OS4wMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0OGVhZDYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDUiIHN0b3AtY29sb3I9IiNhMWYyZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjBlN2ZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMiIgeDE9IjM4LjQ4IiB5MT0iNjIuMzMiIHgyPSIxNzEuNTciIHkyPSIyMDguNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxOGQxZjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDBiNGRlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMyIgeDE9Ii04Ni43MSIgeTE9IjIxNy41NSIgeDI9IjI2My4zNSIgeTI9IjM5LjQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UyZWNlZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMjYyYjQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMjcxLjY0LDE0NS41Yy0xLjMxLDE5LjkzLTcuMDIsMzguNzQtMTYuMTksNTUuNDloLTExMy41Yy0uNDcuMDktMS4wMy4wOS0xLjU5LjA5LTEuOTYsMC0zLjkzLS4wOS01Ljg5LS4xOS0yLjE1LS4wOS00LjQtLjM3LTYuNTUtLjY2LTEuNTktLjE5LTMuMTgtLjM3LTQuNjgtLjc1LS44NC0uMDktMS42OC0uMjgtMi41My0uNDctMi4wNi0uMzctNC4xMi0uOTQtNi4wOC0xLjUtMS42OC0uNDctMy4yNy0uOTQtNC45Ni0xLjUtLjI4LS4wOS0uNTYtLjE5LS44NC0uMjgtMS41LS41Ni0yLjktMS4xMi00LjMtMS42OC0xLjY4LS42Ni0zLjI4LTEuNC00Ljg3LTIuMDZsLS4wOS0uMDljLS4xOS0uMDktLjM3LS4xOS0uNTYtLjI4LS4yOC0uMDktLjY2LS4yOC0uOTQtLjQ3LTIuOS0xLjQtNS42MS0yLjk5LTguMzMtNC42OC0uMDksMC0uMjgtLjA5LS4zNy0uMTktMS4xMi0uNjYtMi4xNS0xLjQtMy4xOC0yLjE1LS4xOS0uMDktLjI4LS4xOS0uMzctLjI4LTEuMzEtLjg0LTIuNjItMS43OC0zLjg0LTIuODFoLS4wOWMtLjk0LS43NS0xLjg3LTEuNTktMi44MS0yLjI1LS45NC0uODQtMS43OC0xLjUtMi42Mi0yLjI1LS45NC0uNzUtMS43OC0xLjU5LTIuNjItMi40M2wtMi41My0yLjUzYy0yLjI1LTIuMjUtNC4zLTQuNjgtNi4yNy03LjExLTEuMDMtMS4yMi0xLjk2LTIuNTMtMi45LTMuODQtMS44Ny0yLjUzLTMuNjUtNS4yNC01LjMzLTcuOTUtMy40Ni01LjgtNi4yNy0xMi4wNy04LjUxLTE4LjUzLS43NS0yLjA2LTEuMzEtNC4xMi0xLjg3LTYuMTgtLjQ3LTEuNTktLjk0LTMuMjctMS4zMS01LjA1LS42Ni0yLjktMS4xMi01LjgtMS41LTguODktLjM3LTIuMTUtLjU2LTQuMy0uNjYtNi40Ni0uMTktMi4zNC0uMjgtNC43Ny0uMjgtNy4xMSwwLTUuMjQuMzctMTAuMzksMS4yMi0xNS40NC4xOS0xLjU5LjQ3LTMuMTguODQtNC42OC4xOS0xLjQuNDctMi43MS44NC00LjAyLjE5LTEuMTIuNDctMi4yNS45NC0zLjM3LjE5LTEuMzEuNTYtMi41MywxLjAzLTMuNzQuMjgtMS4xMi42Ni0yLjI1LDEuMTItMy4zNy41Ni0xLjY4LDEuMTItMy4yOCwxLjg3LTQuODcsMS4yMi0zLjA5LDIuNzEtNi4xOCw0LjIxLTkuMDgsMS4zMS0yLjM0LDIuNzEtNC42OCw0LjEyLTYuOTIsMS41LTIuMjUsMy4wOS00LjQsNC42OC02LjU1LDEuNTktMi4xNSwzLjM3LTQuMjEsNS4xNS02LjE4LDEuNzgtMi4wNiwzLjY1LTMuOTMsNS42MS01LjgsMS43OC0xLjY4LDMuNTYtMy4yNyw1LjUyLTQuNzcuNTYtLjU2LDEuMTItLjk0LDEuNjgtMS4zMSwxLjIyLTEuMTIsMi42Mi0yLjA2LDMuOTMtMi45OS42Ni0uNDcsMS4zMS0uOTQsMS45Ny0xLjMxLDEuOTctMS40LDQuMDItMi42Miw2LjE4LTMuODQsMi43MS0xLjUsNS42MS0yLjk5LDguNTItNC4yMSwxLjY4LS43NSwzLjM3LTEuNSw1LjE1LTIuMDYuNDctLjE5LDEuMDMtLjM3LDEuNS0uNTYsMi4zNC0uODQsNC43Ny0xLjU5LDcuMi0yLjI1LjQ3LS4xOSwxLjAzLS4yOCwxLjU5LS40Ny41Ni0uMDksMS4wMy0uMTksMS41OS0uMzcuOTQtLjI4LDIuMDYtLjM3LDMuMDktLjY2aC4zN2MxLjAzLS4yOCwyLjA2LS40NywzLjA5LS41Ni42NS0uMDksMS4yMi0uMTksMS43OC0uMjgsMS42OC0uMTksMy4yNy0uMzcsNC44Ny0uNDdoLjE5cS4wOS0uMDkuMTktLjA5aC4wOWMuMzcsMCwuODQsMCwxLjMxLS4wOS4zNywwLC44NC0uMDksMS4yMi0uMDkuMjgtLjA5LjQ3LS4wOS42Ni0uMDloMS4zMWMtMzguMDgsMi4zNC02OC4xMiwzMy45Ny02OC4xMiw3Mi43LDAsNy41OCwxLjEyLDE0Ljg4LDMuMzcsMjEuOCw5LjA4LDI4LjQ1LDM1LjQ2LDQ5LjMxLDY2LjYyLDUwLjkuOTQuMDksMS44Ny4wOSwyLjgxLjA5aDEyOS42OVoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yNTUuNDUsMjAwLjk5Yy0xNS40NywyOC41OS00MC45Myw1MC45Ny03MS43NCw2Mi40OC0xMy4zLDQuOTctMjcuNTYsNi44Ni00MS43Niw2Ljg2aDBjLTM3LjI0LDAtNzEuMDItMTMuNjYtOTYuNDctMzUuOTNDMTkuMjgsMjExLjE5LDIuMjUsMTc4LjcyLjE5LDE0Mi40MWMtLjA5LTIuMTUtLjE5LTQuMjEtLjE5LTYuMzYsMC00LjYuMjUtOS4xMS41OS0xMy41NC4zMi00LjA3Ljk2LTguMTIsMS43OS0xMi4xMi41OC0yLjgsMS4xNS01LjYsMS45Mi04LjNDMTkuMDksNDYuMTMsNzAuNDYsMy45MywxMzIuNjguMjhxLS4wOSwwLS4xOS4wOWgtLjE5Yy0xLjU5LjA5LTMuMTguMjgtNC43Ny41Ni0uNjYsMC0xLjIyLjA5LTEuODcuMTktMS4wMy4wOS0yLjA2LjI4LTMuMDkuNTZoLS4wOXEtLjA5LDAtLjE5LjA5Yy0xLjEyLjE5LTIuMTUuMzctMy4xOC42Ni0uNDcuMDktMS4wMy4xOS0xLjU5LjI4LS41Ni4xOS0xLjEyLjI4LTEuNTkuNDctMTUuODEsNC4yMS0zMC4wNCwxMi4yNi00MS42NCwyMy4zLTUuODksNS40My0xMS4wNCwxMS43LTE1LjQ0LDE4LjUzLTEwLjIsMTUuOTEtMTYuMTksMzUtMTYuMTksNTUuNDksMCwxOS4wOSw1LjE1LDM2Ljk2LDE0LjEzLDUyLjIxLDEuNjgsMi43MSwzLjQ2LDUuNDMsNS4zMyw3Ljk1Ljk0LDEuMzEsMS44NywyLjYyLDIuOSwzLjg0LDEuOTcsMi40Myw0LjAyLDQuODcsNi4yNyw3LjExLDEuNjgsMS42OCwzLjM3LDMuMzcsNS4xNSw0Ljk2LDEuNzgsMS41LDMuNTYsMi45OSw1LjQzLDQuNDloLjA5YzEuMjIsMS4wMywyLjUzLDEuOTYsMy44NCwyLjgxLjA5LjA5LjE5LjE5LjM3LjI4LDEuMDMuNzUsMi4wNiwxLjUsMy4xOCwyLjE1LjA5LjA5LjI4LjE5LjM3LjE5LDIuNzEsMS42OCw1LjQzLDMuMjgsOC4zMyw0LjY4LjI4LjE5LjY2LjM3Ljk0LjQ3LjE5LjA5LjM3LjE5LjU2LjI4LDEuNTkuNzUsMy4yOCwxLjUsNC45NiwyLjE1LDEuNC41NiwyLjgxLDEuMTIsNC4zLDEuNjgsMy44NCwxLjMxLDcuNzcsMi40MywxMS44OCwzLjI4Ljg0LjE5LDEuNjguMzcsMi41My40NywxLjUuMzcsMy4wOS41Niw0LjY4Ljc1LDIuMTUuMjgsNC40LjU2LDYuNTUuNjYsMS45Ni4wOSwzLjkzLjE5LDUuODkuMTkuNTYsMCwxLjEyLDAsMS41OS0uMDloMTEzLjVaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjcyLjAxLDEzNi4wNWMwLDMuMTgtLjA5LDYuMjctLjM3LDkuNDVoLTEyOS42OWMtLjk0LDAtMS44NywwLTIuODEtLjA5LTMxLjE2LTEuNTktNTcuNTUtMjIuNDYtNjYuNjItNTAuOS0yLjI1LTYuOTItMy4zNy0xNC4yMi0zLjM3LTIxLjhDNjkuMTUsMzMuOTcsOTkuMTksMi4zNCwxMzcuMjcsMGM3NC41OC43NSwxMzQuNzQsNjEuMzgsMTM0Ljc0LDEzNi4wNVoiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik00OTAuNDUsMjA0LjU2Yy0xLjgsMS41MS01LjE1LDMuNTMtMTAuMDQsNi4wOS00Ljg5LDIuNTYtMTAuODcsNC44Mi0xNy45NCw2Ljc3LTcuMDcsMS45NS0xNC44OSwyLjg1LTIzLjQ2LDIuNzEtMTMuMDgtLjMtMjQuNzgtMi42Ny0zNS4wOC03LjExLTEwLjMtNC40My0xOS4wMy0xMC40OS0yNi4xNy0xOC4xNi03LjE0LTcuNjctMTIuNi0xNi40Ny0xNi4zNi0yNi4zOS0zLjc2LTkuOTMtNS42NC0yMC41My01LjY0LTMxLjgxLDAtMTIuNjMsMS45Mi0yNC4yMSw1Ljc1LTM0Ljc0LDMuODQtMTAuNTMsOS4zMi0xOS42MywxNi40Ny0yNy4zLDcuMTQtNy42NywxNS42OC0xMy42MSwyNS42LTE3LjgyLDkuOTItNC4yMSwyMC45LTYuMzEsMzIuOTQtNi4zMSwxMS4xMywwLDIwLjk4LDEuNTEsMjkuNTUsNC41MSw4LjU3LDMuMDEsMTUuNTYsNi4yNCwyMC45OCw5LjdsLTEyLjg2LDMwLjkxYy0zLjc2LTIuODYtOC43Ni01LjgzLTE1LTguOTEtNi4yNC0zLjA4LTEzLjQyLTQuNjMtMjEuNTQtNC42My02LjMyLDAtMTIuMzcsMS4zMi0xOC4xNiwzLjk1LTUuNzksMi42My0xMC45MSw2LjM2LTE1LjM0LDExLjE3LTQuNDQsNC44MS03LjkzLDEwLjQyLTEwLjQ5LDE2LjgxLTIuNTYsNi4zOS0zLjgzLDEzLjM1LTMuODMsMjAuODcsMCw3Ljk3LDEuMTYsMTUuMjcsMy41LDIxLjg4LDIuMzMsNi42Miw1LjY4LDEyLjI5LDEwLjA0LDE3LjAzczkuNTksOC4zOSwxNS42OCwxMC45NGM2LjA5LDIuNTYsMTIuOTcsMy44NCwyMC42NCwzLjg0LDguODcsMCwxNi40Ny0xLjQzLDIyLjc4LTQuMjksNi4zMi0yLjg1LDExLjEzLTUuODYsMTQuNDQtOS4wMmwxMy41NCwyOS4zM1oiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik01MzEuMDYsMTM1LjUzYzAtMTEuNDMsMi4xOC0yMi4yNiw2LjU0LTMyLjQ5LDQuMzYtMTAuMjMsMTAuNDEtMTkuMjksMTguMTYtMjcuMTgsNy43NC03LjksMTYuNzMtMTQuMSwyNi45Ni0xOC42MSwxMC4yMi00LjUxLDIxLjItNi43NywzMi45NC02Ljc3czIyLjQ4LDIuMjUsMzIuNzEsNi43NywxOS4yOSwxMC43MSwyNy4xOCwxOC42MWM3LjksNy45LDE0LjA2LDE2Ljk2LDE4LjUsMjcuMTgsNC40NCwxMC4yMyw2LjY2LDIxLjA2LDYuNjYsMzIuNDlzLTIuMjIsMjIuNzEtNi42NiwzMi45NGMtNC40NCwxMC4yMy0xMC42LDE5LjIxLTE4LjUsMjYuOTYtNy44OSw3Ljc1LTE2Ljk2LDEzLjgtMjcuMTgsMTguMTYtMTAuMjMsNC4zNi0yMS4xMyw2LjU0LTMyLjcxLDYuNTRzLTIyLjcxLTIuMTgtMzIuOTQtNi41NGMtMTAuMjMtNC4zNi0xOS4yMi0xMC40MS0yNi45Ni0xOC4xNi03Ljc1LTcuNzQtMTMuOC0xNi43My0xOC4xNi0yNi45Ni00LjM2LTEwLjIzLTYuNTQtMjEuMjEtNi41NC0zMi45NFpNNTY0LjksMTM1LjUzYzAsNy4zNywxLjMyLDE0LjI1LDMuOTUsMjAuNjQsMi42Myw2LjQsNi4zMiwxMi4wNCwxMS4wNSwxNi45Miw0Ljc0LDQuODksMTAuMjMsOC42OCwxNi40NywxMS4zOSw2LjI0LDIuNzEsMTMuMDUsNC4wNiwyMC40MSw0LjA2czEzLjY1LTEuMzUsMTkuNzQtNC4wNmM2LjA5LTIuNzEsMTEuMzktNi41LDE1LjktMTEuMzksNC41MS00Ljg5LDguMDQtMTAuNTMsMTAuNi0xNi45MiwyLjU2LTYuMzksMy44NC0xMy4yNywzLjg0LTIwLjY0cy0xLjMyLTE0LjUxLTMuOTUtMjAuOThjLTIuNjMtNi40Ni02LjI0LTEyLjE1LTEwLjgzLTE3LjAzLTQuNTktNC44OS05Ljk2LTguNjktMTYuMTMtMTEuMzktNi4xNy0yLjcxLTEyLjg2LTQuMDYtMjAuMDgtNC4wNnMtMTMuOTEsMS4zNS0yMC4wOCw0LjA2Yy02LjE3LDIuNzEtMTEuNTgsNi41MS0xNi4yNCwxMS4zOS00LjY2LDQuODktOC4yNywxMC41Ny0xMC44MywxNy4wMy0yLjU2LDYuNDctMy44NCwxMy40Ni0zLjg0LDIwLjk4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTc1MS40NiwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTk4Ny44OCwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTEyNTMuNjMsMTU2Ljk2YzAsNS4yNywxLjU4LDEwLjMsNC43NCwxNS4xMiwzLjE2LDQuODEsNy4zMyw4LjcyLDEyLjUyLDExLjczLDUuMTksMy4wMSwxMC44Niw0LjUxLDE3LjAzLDQuNTEsNi43NywwLDEyLjc4LTEuNSwxOC4wNS00LjUxLDUuMjYtMy4wMSw5LjQzLTYuOTIsMTIuNTItMTEuNzMsMy4wOC00LjgxLDQuNjItOS44NSw0LjYyLTE1LjEyVjUyLjI5aDMyLjI2djEwNS4zNWMwLDEyLjE4LTMuMDEsMjIuOTgtOS4wMiwzMi4zNy02LjAyLDkuNC0xNC4xNCwxNi43Ny0yNC4zNiwyMi4xMS0xMC4yMyw1LjM0LTIxLjU4LDguMDEtMzQuMDcsOC4wMXMtMjMuNTctMi42Ny0zMy43My04LjAxYy0xMC4xNS01LjM0LTE4LjI0LTEyLjcxLTI0LjI1LTIyLjExLTYuMDItOS40LTkuMDItMjAuMTktOS4wMi0zMi4zN1Y1Mi4yOWgzMi43MXYxMDQuNjdaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTU2Ni4wNywyMjUuMDlsLTEyNS44OC0xMTMuNyw5LjcsNS40MS42OCwxMDEuNTJoLTMzLjE2VjQ1Ljc1aDEuMzVsMTIzLjE3LDExMy4yNS03LjIyLTMuMTYtLjY4LTEwMy41NWgzMi45NHYxNzIuOGgtLjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTYzMi40LDUyLjI5aDMyLjcxdjE2Ni4wNGgtMzIuNzFWNTIuMjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTcyMy43Niw1Mi4yOWgxMTEuODl2MzEuNThoLTQwLjM4djEzNC40NWgtMzIuNzFWODMuODdoLTM4Ljgxdi0zMS41OFoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xOTMyLjg4LDE2Ni42NmwtNjEuMTMtMTE0LjM4aDQwLjM4bDQyLjg2LDg2LjE3LTkuNy42OCw0Mi4xOC04Ni44NWg0MC4zOWwtNjIuMjYsMTE0LjM4djUxLjY2aC0zMi43MXYtNTEuNjZaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjA2Ni40Myw1OC4xNWgxMDQuOXYxMC42aC00Ny4xNXYxNDkuNTdoLTExLjA1VjY4Ljc1aC00Ni43di0xMC42WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTIyMDYuMDcsMjE4LjMybDY3LjY4LTE2Ny4xNmguOWw2Ny42OCwxNjcuMTZoLTEyLjQxbC01OC44OC0xNDkuNTcsNy42Ny00LjI5LTYxLjU5LDE1My44NWgtMTEuMDVaTTIyMzguNzgsMTU0LjkzaDcxLjA2bDMuMTYsMTAuMzhoLTc2LjkzbDIuNzEtMTAuMzhaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjM4Ni4wOSwyMTguMzJsNTQuMTQtODQuNiw1Ljg2LDkuNy00Ni40Nyw3NC45aC0xMy41M1pNMjM4OC4zNSw1OC4xNWgxMy43NmwxMDQuMjIsMTYwLjE3aC0xMy45OWwtMTA0LTE2MC4xN1pNMjQ0NS40MiwxMzAuMTJsNDQuODktNzEuOTZoMTMuMDhsLTUxLjY2LDgwLjc2LTYuMzItOC44WiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=';  // white SVG embedded
var CTAX_LOGO_BLUE  = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjUwNi4zMyAyNzAuMzMiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTMpOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTIpOwogICAgICB9CgogICAgICAuY2xzLTMgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50KTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjMmQ1NTkzOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHgxPSIxOS4yMiIgeTE9Ii4wNCIgeDI9IjIwNi42NCIgeTI9IjE4OS4wMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0OGVhZDYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDUiIHN0b3AtY29sb3I9IiNhMWYyZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjBlN2ZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMiIgeDE9IjM4LjQ4IiB5MT0iNjIuMzMiIHgyPSIxNzEuNTciIHkyPSIyMDguNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxOGQxZjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDBiNGRlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMyIgeDE9Ii04Ni43MSIgeTE9IjIxNy41NSIgeDI9IjI2My4zNSIgeTI9IjM5LjQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzJkNTU5MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMjYyYjQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+CiAgICA8Zz4KICAgICAgPHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMjcxLjY0LDE0NS41Yy0xLjMxLDE5LjkzLTcuMDIsMzguNzQtMTYuMTksNTUuNDloLTExMy41Yy0uNDcuMDktMS4wMy4wOS0xLjU5LjA5LTEuOTYsMC0zLjkzLS4wOS01Ljg5LS4xOS0yLjE1LS4wOS00LjQtLjM3LTYuNTUtLjY2LTEuNTktLjE5LTMuMTgtLjM3LTQuNjgtLjc1LS44NC0uMDktMS42OC0uMjgtMi41My0uNDctMi4wNi0uMzctNC4xMi0uOTQtNi4wOC0xLjUtMS42OC0uNDctMy4yNy0uOTQtNC45Ni0xLjUtLjI4LS4wOS0uNTYtLjE5LS44NC0uMjgtMS41LS41Ni0yLjktMS4xMi00LjMtMS42OC0xLjY4LS42Ni0zLjI4LTEuNC00Ljg3LTIuMDZsLS4wOS0uMDljLS4xOS0uMDktLjM3LS4xOS0uNTYtLjI4LS4yOC0uMDktLjY2LS4yOC0uOTQtLjQ3LTIuOS0xLjQtNS42MS0yLjk5LTguMzMtNC42OC0uMDksMC0uMjgtLjA5LS4zNy0uMTktMS4xMi0uNjYtMi4xNS0xLjQtMy4xOC0yLjE1LS4xOS0uMDktLjI4LS4xOS0uMzctLjI4LTEuMzEtLjg0LTIuNjItMS43OC0zLjg0LTIuODFoLS4wOWMtLjk0LS43NS0xLjg3LTEuNTktMi44MS0yLjI1LS45NC0uODQtMS43OC0xLjUtMi42Mi0yLjI1LS45NC0uNzUtMS43OC0xLjU5LTIuNjItMi40M2wtMi41My0yLjUzYy0yLjI1LTIuMjUtNC4zLTQuNjgtNi4yNy03LjExLTEuMDMtMS4yMi0xLjk2LTIuNTMtMi45LTMuODQtMS44Ny0yLjUzLTMuNjUtNS4yNC01LjMzLTcuOTUtMy40Ni01LjgtNi4yNy0xMi4wNy04LjUxLTE4LjUzLS43NS0yLjA2LTEuMzEtNC4xMi0xLjg3LTYuMTgtLjQ3LTEuNTktLjk0LTMuMjctMS4zMS01LjA1LS42Ni0yLjktMS4xMi01LjgtMS41LTguODktLjM3LTIuMTUtLjU2LTQuMy0uNjYtNi40Ni0uMTktMi4zNC0uMjgtNC43Ny0uMjgtNy4xMSwwLTUuMjQuMzctMTAuMzksMS4yMi0xNS40NC4xOS0xLjU5LjQ3LTMuMTguODQtNC42OC4xOS0xLjQuNDctMi43MS44NC00LjAyLjE5LTEuMTIuNDctMi4yNS45NC0zLjM3LjE5LTEuMzEuNTYtMi41MywxLjAzLTMuNzQuMjgtMS4xMi42Ni0yLjI1LDEuMTItMy4zNy41Ni0xLjY4LDEuMTItMy4yOCwxLjg3LTQuODcsMS4yMi0zLjA5LDIuNzEtNi4xOCw0LjIxLTkuMDgsMS4zMS0yLjM0LDIuNzEtNC42OCw0LjEyLTYuOTIsMS41LTIuMjUsMy4wOS00LjQsNC42OC02LjU1LDEuNTktMi4xNSwzLjM3LTQuMjEsNS4xNS02LjE4LDEuNzgtMi4wNiwzLjY1LTMuOTMsNS42MS01LjgsMS43OC0xLjY4LDMuNTYtMy4yNyw1LjUyLTQuNzcuNTYtLjU2LDEuMTItLjk0LDEuNjgtMS4zMSwxLjIyLTEuMTIsMi42Mi0yLjA2LDMuOTMtMi45OS42Ni0uNDcsMS4zMS0uOTQsMS45Ny0xLjMxLDEuOTctMS40LDQuMDItMi42Miw2LjE4LTMuODQsMi43MS0xLjUsNS42MS0yLjk5LDguNTItNC4yMSwxLjY4LS43NSwzLjM3LTEuNSw1LjE1LTIuMDYuNDctLjE5LDEuMDMtLjM3LDEuNS0uNTYsMi4zNC0uODQsNC43Ny0xLjU5LDcuMi0yLjI1LjQ3LS4xOSwxLjAzLS4yOCwxLjU5LS40Ny41Ni0uMDksMS4wMy0uMTksMS41OS0uMzcuOTQtLjI4LDIuMDYtLjM3LDMuMDktLjY2aC4zN2MxLjAzLS4yOCwyLjA2LS40NywzLjA5LS41Ni42NS0uMDksMS4yMi0uMTksMS43OC0uMjgsMS42OC0uMTksMy4yNy0uMzcsNC44Ny0uNDdoLjE5cS4wOS0uMDkuMTktLjA5aC4wOWMuMzcsMCwuODQsMCwxLjMxLS4wOS4zNywwLC44NC0uMDksMS4yMi0uMDkuMjgtLjA5LjQ3LS4wOS42Ni0uMDloMS4zMWMtMzguMDgsMi4zNC02OC4xMiwzMy45Ny02OC4xMiw3Mi43LDAsNy41OCwxLjEyLDE0Ljg4LDMuMzcsMjEuOCw5LjA4LDI4LjQ1LDM1LjQ2LDQ5LjMxLDY2LjYyLDUwLjkuOTQuMDksMS44Ny4wOSwyLjgxLjA5aDEyOS42OVoiLz4KICAgICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjU1LjQ1LDIwMC45OWMtMTUuNDcsMjguNTktNDAuOTMsNTAuOTctNzEuNzQsNjIuNDgtMTMuMyw0Ljk3LTI3LjU2LDYuODYtNDEuNzYsNi44NmgwYy0zNy4yNCwwLTcxLjAyLTEzLjY2LTk2LjQ3LTM1LjkzQzE5LjI4LDIxMS4xOSwyLjI1LDE3OC43Mi4xOSwxNDIuNDFjLS4wOS0yLjE1LS4xOS00LjIxLS4xOS02LjM2LDAtNC42LjI1LTkuMTEuNTktMTMuNTQuMzItNC4wNy45Ni04LjEyLDEuNzktMTIuMTIuNTgtMi44LDEuMTUtNS42LDEuOTItOC4zQzE5LjA5LDQ2LjEzLDcwLjQ2LDMuOTMsMTMyLjY4LjI4cS0uMDksMC0uMTkuMDloLS4xOWMtMS41OS4wOS0zLjE4LjI4LTQuNzcuNTYtLjY2LDAtMS4yMi4wOS0xLjg3LjE5LTEuMDMuMDktMi4wNi4yOC0zLjA5LjU2aC0uMDlxLS4wOSwwLS4xOS4wOWMtMS4xMi4xOS0yLjE1LjM3LTMuMTguNjYtLjQ3LjA5LTEuMDMuMTktMS41OS4yOC0uNTYuMTktMS4xMi4yOC0xLjU5LjQ3LTE1LjgxLDQuMjEtMzAuMDQsMTIuMjYtNDEuNjQsMjMuMy01Ljg5LDUuNDMtMTEuMDQsMTEuNy0xNS40NCwxOC41My0xMC4yLDE1LjkxLTE2LjE5LDM1LTE2LjE5LDU1LjQ5LDAsMTkuMDksNS4xNSwzNi45NiwxNC4xMyw1Mi4yMSwxLjY4LDIuNzEsMy40Niw1LjQzLDUuMzMsNy45NS45NCwxLjMxLDEuODcsMi42MiwyLjksMy44NCwxLjk3LDIuNDMsNC4wMiw0Ljg3LDYuMjcsNy4xMSwxLjY4LDEuNjgsMy4zNywzLjM3LDUuMTUsNC45NiwxLjc4LDEuNSwzLjU2LDIuOTksNS40Myw0LjQ5aC4wOWMxLjIyLDEuMDMsMi41MywxLjk2LDMuODQsMi44MS4wOS4wOS4xOS4xOS4zNy4yOCwxLjAzLjc1LDIuMDYsMS41LDMuMTgsMi4xNS4wOS4wOS4yOC4xOS4zNy4xOSwyLjcxLDEuNjgsNS40MywzLjI4LDguMzMsNC42OC4yOC4xOS42Ni4zNy45NC40Ny4xOS4wOS4zNy4xOS41Ni4yOCwxLjU5Ljc1LDMuMjgsMS41LDQuOTYsMi4xNSwxLjQuNTYsMi44MSwxLjEyLDQuMywxLjY4LDMuODQsMS4zMSw3Ljc3LDIuNDMsMTEuODgsMy4yOC44NC4xOSwxLjY4LjM3LDIuNTMuNDcsMS41LjM3LDMuMDkuNTYsNC42OC43NSwyLjE1LjI4LDQuNC41Niw2LjU1LjY2LDEuOTYuMDksMy45My4xOSw1Ljg5LjE5LjU2LDAsMS4xMiwwLDEuNTktLjA5aDExMy41WiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNzIuMDEsMTM2LjA1YzAsMy4xOC0uMDksNi4yNy0uMzcsOS40NWgtMTI5LjY5Yy0uOTQsMC0xLjg3LDAtMi44MS0uMDktMzEuMTYtMS41OS01Ny41NS0yMi40Ni02Ni42Mi01MC45LTIuMjUtNi45Mi0zLjM3LTE0LjIyLTMuMzctMjEuOEM2OS4xNSwzMy45Nyw5OS4xOSwyLjM0LDEzNy4yNywwYzc0LjU4Ljc1LDEzNC43NCw2MS4zOCwxMzQuNzQsMTM2LjA1WiIvPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik00OTAuNDUsMjA0LjU2Yy0xLjgsMS41MS01LjE1LDMuNTMtMTAuMDQsNi4wOS00Ljg5LDIuNTYtMTAuODcsNC44Mi0xNy45NCw2Ljc3LTcuMDcsMS45NS0xNC44OSwyLjg1LTIzLjQ2LDIuNzEtMTMuMDgtLjMtMjQuNzgtMi42Ny0zNS4wOC03LjExLTEwLjMtNC40My0xOS4wMy0xMC40OS0yNi4xNy0xOC4xNi03LjE0LTcuNjctMTIuNi0xNi40Ny0xNi4zNi0yNi4zOS0zLjc2LTkuOTMtNS42NC0yMC41My01LjY0LTMxLjgxLDAtMTIuNjMsMS45Mi0yNC4yMSw1Ljc1LTM0Ljc0LDMuODQtMTAuNTMsOS4zMi0xOS42MywxNi40Ny0yNy4zLDcuMTQtNy42NywxNS42OC0xMy42MSwyNS42LTE3LjgyLDkuOTItNC4yMSwyMC45LTYuMzEsMzIuOTQtNi4zMSwxMS4xMywwLDIwLjk4LDEuNTEsMjkuNTUsNC41MSw4LjU3LDMuMDEsMTUuNTYsNi4yNCwyMC45OCw5LjdsLTEyLjg2LDMwLjkxYy0zLjc2LTIuODYtOC43Ni01LjgzLTE1LTguOTEtNi4yNC0zLjA4LTEzLjQyLTQuNjMtMjEuNTQtNC42My02LjMyLDAtMTIuMzcsMS4zMi0xOC4xNiwzLjk1LTUuNzksMi42My0xMC45MSw2LjM2LTE1LjM0LDExLjE3LTQuNDQsNC44MS03LjkzLDEwLjQyLTEwLjQ5LDE2LjgxLTIuNTYsNi4zOS0zLjgzLDEzLjM1LTMuODMsMjAuODcsMCw3Ljk3LDEuMTYsMTUuMjcsMy41LDIxLjg4LDIuMzMsNi42Miw1LjY4LDEyLjI5LDEwLjA0LDE3LjAzczkuNTksOC4zOSwxNS42OCwxMC45NGM2LjA5LDIuNTYsMTIuOTcsMy44NCwyMC42NCwzLjg0LDguODcsMCwxNi40Ny0xLjQzLDIyLjc4LTQuMjksNi4zMi0yLjg1LDExLjEzLTUuODYsMTQuNDQtOS4wMmwxMy41NCwyOS4zM1oiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik01MzEuMDYsMTM1LjUzYzAtMTEuNDMsMi4xOC0yMi4yNiw2LjU0LTMyLjQ5LDQuMzYtMTAuMjMsMTAuNDEtMTkuMjksMTguMTYtMjcuMTgsNy43NC03LjksMTYuNzMtMTQuMSwyNi45Ni0xOC42MSwxMC4yMi00LjUxLDIxLjItNi43NywzMi45NC02Ljc3czIyLjQ4LDIuMjUsMzIuNzEsNi43NywxOS4yOSwxMC43MSwyNy4xOCwxOC42MWM3LjksNy45LDE0LjA2LDE2Ljk2LDE4LjUsMjcuMTgsNC40NCwxMC4yMyw2LjY2LDIxLjA2LDYuNjYsMzIuNDlzLTIuMjIsMjIuNzEtNi42NiwzMi45NGMtNC40NCwxMC4yMy0xMC42LDE5LjIxLTE4LjUsMjYuOTYtNy44OSw3Ljc1LTE2Ljk2LDEzLjgtMjcuMTgsMTguMTYtMTAuMjMsNC4zNi0yMS4xMyw2LjU0LTMyLjcxLDYuNTRzLTIyLjcxLTIuMTgtMzIuOTQtNi41NGMtMTAuMjMtNC4zNi0xOS4yMi0xMC40MS0yNi45Ni0xOC4xNi03Ljc1LTcuNzQtMTMuOC0xNi43My0xOC4xNi0yNi45Ni00LjM2LTEwLjIzLTYuNTQtMjEuMjEtNi41NC0zMi45NFpNNTY0LjksMTM1LjUzYzAsNy4zNywxLjMyLDE0LjI1LDMuOTUsMjAuNjQsMi42Myw2LjQsNi4zMiwxMi4wNCwxMS4wNSwxNi45Miw0Ljc0LDQuODksMTAuMjMsOC42OCwxNi40NywxMS4zOSw2LjI0LDIuNzEsMTMuMDUsNC4wNiwyMC40MSw0LjA2czEzLjY1LTEuMzUsMTkuNzQtNC4wNmM2LjA5LTIuNzEsMTEuMzktNi41LDE1LjktMTEuMzksNC41MS00Ljg5LDguMDQtMTAuNTMsMTAuNi0xNi45MiwyLjU2LTYuMzksMy44NC0xMy4yNywzLjg0LTIwLjY0cy0xLjMyLTE0LjUxLTMuOTUtMjAuOThjLTIuNjMtNi40Ni02LjI0LTEyLjE1LTEwLjgzLTE3LjAzLTQuNTktNC44OS05Ljk2LTguNjktMTYuMTMtMTEuMzktNi4xNy0yLjcxLTEyLjg2LTQuMDYtMjAuMDgtNC4wNnMtMTMuOTEsMS4zNS0yMC4wOCw0LjA2Yy02LjE3LDIuNzEtMTEuNTgsNi41MS0xNi4yNCwxMS4zOS00LjY2LDQuODktOC4yNywxMC41Ny0xMC44MywxNy4wMy0yLjU2LDYuNDctMy44NCwxMy40Ni0zLjg0LDIwLjk4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTc1MS40NiwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTk4Ny44OCwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTEyNTMuNjMsMTU2Ljk2YzAsNS4yNywxLjU4LDEwLjMsNC43NCwxNS4xMiwzLjE2LDQuODEsNy4zMyw4LjcyLDEyLjUyLDExLjczLDUuMTksMy4wMSwxMC44Niw0LjUxLDE3LjAzLDQuNTEsNi43NywwLDEyLjc4LTEuNSwxOC4wNS00LjUxLDUuMjYtMy4wMSw5LjQzLTYuOTIsMTIuNTItMTEuNzMsMy4wOC00LjgxLDQuNjItOS44NSw0LjYyLTE1LjEyVjUyLjI5aDMyLjI2djEwNS4zNWMwLDEyLjE4LTMuMDEsMjIuOTgtOS4wMiwzMi4zNy02LjAyLDkuNC0xNC4xNCwxNi43Ny0yNC4zNiwyMi4xMS0xMC4yMyw1LjM0LTIxLjU4LDguMDEtMzQuMDcsOC4wMXMtMjMuNTctMi42Ny0zMy43My04LjAxYy0xMC4xNS01LjM0LTE4LjI0LTEyLjcxLTI0LjI1LTIyLjExLTYuMDItOS40LTkuMDItMjAuMTktOS4wMi0zMi4zN1Y1Mi4yOWgzMi43MXYxMDQuNjdaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTU2Ni4wNywyMjUuMDlsLTEyNS44OC0xMTMuNyw5LjcsNS40MS42OCwxMDEuNTJoLTMzLjE2VjQ1Ljc1aDEuMzVsMTIzLjE3LDExMy4yNS03LjIyLTMuMTYtLjY4LTEwMy41NWgzMi45NHYxNzIuOGgtLjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTYzMi40LDUyLjI5aDMyLjcxdjE2Ni4wNGgtMzIuNzFWNTIuMjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTcyMy43Niw1Mi4yOWgxMTEuODl2MzEuNThoLTQwLjM4djEzNC40NWgtMzIuNzFWODMuODdoLTM4Ljgxdi0zMS41OFoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xOTMyLjg4LDE2Ni42NmwtNjEuMTMtMTE0LjM4aDQwLjM4bDQyLjg2LDg2LjE3LTkuNy42OCw0Mi4xOC04Ni44NWg0MC4zOWwtNjIuMjYsMTE0LjM4djUxLjY2aC0zMi43MXYtNTEuNjZaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjA2Ni40Myw1OC4xNWgxMDQuOXYxMC42aC00Ny4xNXYxNDkuNTdoLTExLjA1VjY4Ljc1aC00Ni43di0xMC42WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTIyMDYuMDcsMjE4LjMybDY3LjY4LTE2Ny4xNmguOWw2Ny42OCwxNjcuMTZoLTEyLjQxbC01OC44OC0xNDkuNTcsNy42Ny00LjI5LTYxLjU5LDE1My44NWgtMTEuMDVaTTIyMzguNzgsMTU0LjkzaDcxLjA2bDMuMTYsMTAuMzhoLTc2LjkzbDIuNzEtMTAuMzhaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjM4Ni4wOSwyMTguMzJsNTQuMTQtODQuNiw1Ljg2LDkuNy00Ni40Nyw3NC45aC0xMy41M1pNMjM4OC4zNSw1OC4xNWgxMy43NmwxMDQuMjIsMTYwLjE3aC0xMy45OWwtMTA0LTE2MC4xN1pNMjQ0NS40MiwxMzAuMTJsNDQuODktNzEuOTZoMTMuMDhsLTUxLjY2LDgwLjc2LTYuMzItOC44WiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=';  // blue SVG embedded
var amCurrentTemplate = 1;

// Wire logo upload
(function(){
  function initLogoUpload(){
    var input = document.getElementById('am-logo-input');
    var label = document.getElementById('am-logo-label');
    var drop  = document.getElementById('am-logo-drop');
    if(!input || input._wired) return;
    input._wired = true;
    input.addEventListener('change', function(){
      var file = input.files && input.files[0];
      if(!file) return;
      var allowed = ['image/jpeg','image/png','image/gif','image/webp'];
      if(allowed.indexOf(file.type)===-1){
        if(typeof showToast==='function') showToast('Only JPEG, PNG, GIF, or WebP images allowed','error');
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e){
        amLogoDataUrl = e.target.result;
        if(label) label.textContent = file.name;
        if(drop){ drop.style.borderColor='var(--blue)'; drop.style.background='rgba(11,95,216,0.04)'; }
      };
      reader.readAsDataURL(file);
    });
  }
  var origShow = window.showPage;
  window.showPage = function(id){
    if(origShow) origShow(id);
    if(id==='admaker') setTimeout(initLogoUpload, 100);
  };
  setTimeout(initLogoUpload, 600);
})();

function selectTemplate(n){
  amCurrentTemplate = n;
  document.querySelectorAll('.am-tpl-opt').forEach(function(el){ el.classList.remove('am-tpl-selected'); });
  var sel = document.querySelector('.am-tpl-opt[data-tpl="'+n+'"]');
  if(sel) sel.classList.add('am-tpl-selected');
}

function resizeAd(ratio, realW, realH){
  document.querySelectorAll('.am-size-btn').forEach(function(b){ b.classList.remove('am-size-active'); });
  var btn = document.querySelector('.am-size-btn[data-size="'+ratio+'"]');
  if(btn) btn.classList.add('am-size-active');

  var lbl = document.getElementById('am-size-label');
  if(lbl) lbl.textContent = realW + ' × ' + realH + 'px · ' + ratio;

  window._amRealW = realW;
  window._amRealH = realH;

  // Display at 50%
  var dispW = Math.round(realW * 0.5);
  var dispH = Math.round(realH * 0.5);

  var canvas = document.getElementById('am-ad-canvas');
  var outer  = document.getElementById('am-ad-outer');
  if(!canvas || !outer) return;

  canvas.style.width  = dispW + 'px';
  canvas.style.height = dispH + 'px';
  canvas.style.transform = '';
  outer.style.width   = dispW + 'px';
  outer.style.height  = dispH + 'px';

  var inputs = window._amInputs || {};

  // Pass REAL dimensions for font scaling, but render into display-sized container
  // buildStaticCard uses dims for math only — CSS fills the container via width/height:100%
  canvas.innerHTML = buildStaticCard(
    inputs.firm     || '',
    inputs.platform || 'Facebook',
    inputs.color    || '#0B5FD8',
    inputs.tagline  || '',
    amLogoDataUrl,
    amCurrentTemplate,
    {w: realW, h: realH}   // ← real dims so font math is correct
  );
}


// ── LIVE PREVIEW ──────────────────────────────────────────
function amUpdatePreview() {
  var previewEl = document.getElementById('am-live-preview');
  if (!previewEl) return;
  var firm = (document.getElementById('am-firm') || {value:''}).value.trim();
  if (!firm) {
    previewEl.style.display = 'none';
    return;
  }
  previewEl.style.display = 'block';
  var color = (document.getElementById('am-color') || {value:'#0B5FD8'}).value;
  var tagline = (document.getElementById('am-tagline') || {value:''}).value.trim();
  var canvas = document.getElementById('am-preview-canvas');
  if (!canvas) return;
  canvas.innerHTML = buildStaticCard(firm, 'Facebook', color, tagline, amLogoDataUrl, amCurrentTemplate, {w: 600, h: 314});
}

// Debounced preview updater
var _amPreviewTimer = null;
function amDebouncedPreview() {
  clearTimeout(_amPreviewTimer);
  _amPreviewTimer = setTimeout(amUpdatePreview, 150);
}

// Wire live preview inputs
(function() {
  function wirePreview() {
    ['am-firm', 'am-tagline', 'am-color', 'am-color-hex'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el && !el._previewWired) {
        el._previewWired = true;
        el.addEventListener('input', amDebouncedPreview);
      }
    });
    var platform = document.getElementById('am-platform');
    if (platform && !platform._previewWired) {
      platform._previewWired = true;
      platform.addEventListener('change', amDebouncedPreview);
    }
  }
  // Wire on page show
  var origShow2 = window.showPage;
  window.showPage = function(id) {
    if (origShow2) origShow2(id);
    if (id === 'admaker') setTimeout(wirePreview, 150);
  };
  setTimeout(wirePreview, 700);
})();

// Override selectTemplate to also update preview
var _origSelectTemplate = selectTemplate;
selectTemplate = function(n) {
  _origSelectTemplate(n);
  amDebouncedPreview();
};

function generateStaticAd(){
  var firm     = (document.getElementById('am-firm')    || {value:''}).value.trim();
  var platform = (document.getElementById('am-platform')|| {value:'Facebook'}).value;
  var color    = (document.getElementById('am-color')   || {value:'#0B5FD8'}).value;
  var tagline  = (document.getElementById('am-tagline') || {value:''}).value.trim();
  var errEl    = document.getElementById('am-error');

  if(!firm){
    if(errEl){ errEl.textContent='Please enter your firm name.'; errEl.style.display='block'; }
    return;
  }
  if(errEl) errEl.style.display='none';

  // Store inputs for resize
  window._amInputs = {firm:firm, platform:platform, color:color, tagline:tagline};
  window._amRealW = 1200;
  window._amRealH = 628;

  // Track usage
  if (typeof trackToolUsage === 'function') trackToolUsage('ad-maker');

  // Save to recent results
  if (typeof saveToolResult === 'function') {
    saveToolResult('ad-maker', firm + ' · Template ' + amCurrentTemplate, {
      firm: firm, platform: platform, color: color, tagline: tagline, template: amCurrentTemplate
    });
  }

  var resultsEl = document.getElementById('am-results');
  var formEl    = document.getElementById('am-form-wrap');
  if(formEl)    formEl.style.display = 'none';
  if(resultsEl){ resultsEl.style.visibility='hidden'; resultsEl.style.display='block'; }

  // M2P2C2: Save cross-tool context
  if (typeof saveToolContext === 'function') {
    saveToolContext('ad-maker', { firm: firm, platform: platform, color: color, tagline: tagline, template: amCurrentTemplate });
  }

  // Init at 16:9
  setTimeout(function(){
    resizeAd('16:9', 1200, 628);
    if(resultsEl) resultsEl.style.visibility = '';
    // Trigger AI headline suggestions + platform captions
    generateHeadlines();
    generateCaptions();

    // M2P2C2: Show smart suggestions
    setTimeout(function() { if (typeof showSmartSuggestions === 'function') showSmartSuggestions('ad-maker'); }, 500);
  }, 30);
}

// ── AI HEADLINE SUGGESTIONS ──────────────────────────────
function generateHeadlines() {
  var inputs = window._amInputs || {};
  var firm = inputs.firm || '';
  if (!firm || typeof CTAX_API_URL === 'undefined' || !CTAX_API_KEY) return;

  var container = document.getElementById('am-headlines');
  if (!container) return;
  container.style.display = 'block';
  container.innerHTML = '<div class="f-sec-lbl" style="margin-bottom:10px">AI HEADLINE SUGGESTIONS</div><div style="font-size:14px;color:var(--slate)">Generating headlines...</div>';

  var prompt = 'Generate exactly 3 short, punchy ad headlines (max 8 words each) for a co-branded social media ad between "' + firm + '" and Community Tax (IRS tax resolution firm). The ads target people with IRS tax debt. Format: one headline per line, numbered 1-3. No quotes, no explanation. Headlines should be emotional, urgent, and action-oriented.';

  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{role: 'user', content: prompt}]
    })
  }).then(function(r) { return r.json(); }).then(function(d) {
    var text = d.content && d.content[0] ? d.content[0].text.trim() : '';
    var lines = text.split('\n').filter(function(l) { return l.trim(); }).slice(0, 3);
    var html = '<div class="f-sec-lbl" style="margin-bottom:10px">AI HEADLINE SUGGESTIONS</div><div class="am-hl-list">';
    lines.forEach(function(line) {
      var clean = line.replace(/^\d+[\.\)]\s*/, '').replace(/^["']|["']$/g, '');
      html += '<button class="am-hl-btn" onclick="amApplyHeadline(this)" title="Click to copy">' + clean + '</button>';
    });
    html += '</div><div style="font-size:11px;color:var(--slate);margin-top:6px">Click a headline to copy it for your ad caption</div>';
    container.innerHTML = html;
  }).catch(function() {
    container.style.display = 'none';
  });
}

function amApplyHeadline(btn) {
  var text = btn.textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.classList.add('am-hl-copied');
    setTimeout(function() { btn.classList.remove('am-hl-copied'); }, 1500);
    if (typeof showToast === 'function') showToast('Headline copied', 'copied');
  });
}

// ── BATCH DOWNLOAD ALL SIZES ──────────────────────────────
function downloadAllSizes() {
  var sizes = [
    { ratio: '16:9', w: 1200, h: 628 },
    { ratio: '1:1', w: 1080, h: 1080 },
    { ratio: '4:5', w: 1080, h: 1350 },
    { ratio: '9:16', w: 1080, h: 1920 },
    { ratio: '5:4', w: 1350, h: 1080 }
  ];
  var firm = (document.getElementById('am-firm') || {value:'partner'}).value.trim() || 'partner';
  var firmSlug = firm.replace(/\s+/g, '-').toLowerCase();
  var inputs = window._amInputs || {};

  var btn = document.getElementById('am-batch-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Downloading...'; }

  // Create a temp container for rendering each size
  var temp = document.createElement('div');
  temp.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1';
  document.body.appendChild(temp);

  var idx = 0;
  function downloadNext() {
    if (idx >= sizes.length) {
      document.body.removeChild(temp);
      if (btn) { btn.disabled = false; btn.innerHTML = '<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download All Sizes'; }
      if (typeof showToast === 'function') showToast('All 5 ad sizes downloaded', 'copied');
      return;
    }
    var s = sizes[idx];
    var dispW = Math.round(s.w * 0.5);
    var dispH = Math.round(s.h * 0.5);
    temp.style.width = dispW + 'px';
    temp.style.height = dispH + 'px';
    temp.innerHTML = buildStaticCard(
      inputs.firm || firm, inputs.platform || 'Facebook',
      inputs.color || '#0B5FD8', inputs.tagline || '',
      amLogoDataUrl, amCurrentTemplate, { w: s.w, h: s.h }
    );

    (window.loadHtml2Canvas ? window.loadHtml2Canvas() : Promise.resolve()).then(function() {
      html2canvas(temp, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null }).then(function(cv) {
        var a = document.createElement('a');
        a.href = cv.toDataURL('image/png');
        a.download = firmSlug + '-ctax-' + s.w + 'x' + s.h + '.png';
        a.click();
        idx++;
        setTimeout(downloadNext, 400);
      });
    });
  }

  // Ensure html2canvas is loaded
  if (typeof html2canvas === 'undefined') {
    var sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    sc.onload = downloadNext;
    document.head.appendChild(sc);
  } else {
    downloadNext();
  }
}

function buildStaticCard(firm, platform, brandColor, tagline, logoUrl, tpl, dims){
  var w = dims ? dims.w : 600;
  var h = dims ? dims.h : 314;

  var configs = {
    1: { bg:'linear-gradient(135deg,#0A1628 0%,#112244 60%,#1a3160 100%)', text:'#fff', sub:'rgba(255,255,255,0.82)', ctaBg:brandColor, ctaText:'#fff', pill:'rgba(255,255,255,0.38)', div:'rgba(255,255,255,0.1)' },
    2: { bg:'linear-gradient(135deg,'+brandColor+' 0%,#0099CC 100%)',       text:'#fff', sub:'rgba(255,255,255,0.88)', ctaBg:'#fff',       ctaText:brandColor, pill:'rgba(255,255,255,0.55)', div:'rgba(255,255,255,0.18)' },
    3: { bg:'#ffffff', text:'#0A1628', sub:'rgba(10,22,40,0.72)', ctaBg:brandColor, ctaText:'#fff', pill:'rgba(10,22,40,0.38)', div:'rgba(10,22,40,0.08)' },
    4: { bg:'linear-gradient(135deg,#0A1628 0%,'+brandColor+' 50%,#00C8E0 100%)', text:'#fff', sub:'rgba(255,255,255,0.9)', ctaBg:'rgba(255,255,255,0.95)', ctaText:'#0A1628', pill:'rgba(255,255,255,0.45)', div:'rgba(255,255,255,0.15)' },
    5: { bg:'#0A1628', text:'#fff', sub:'rgba(255,255,255,0.75)', ctaBg:brandColor, ctaText:'#fff', pill:'rgba(255,255,255,0.35)', div:'rgba(255,255,255,0.08)' },
    6: { bg:'#f8fafc', text:'#0A1628', sub:'rgba(10,22,40,0.6)', ctaBg:'#0A1628', ctaText:'#fff', pill:'rgba(10,22,40,0.3)', div:'rgba(10,22,40,0.06)' }
  };
  var t = configs[tpl] || configs[1];

  // Community Tax logo — white for dark/gradient templates, blue for white template
  var ctaxSrc = (tpl === 3) ? CTAX_LOGO_BLUE : CTAX_LOGO_WHITE;
  var ctaxOpacity = '1';
  function ctaxLogo(h){ return '<img src="'+ctaxSrc+'" style="height:'+h+';width:auto;object-fit:contain">'; }

  // Partner logo or firm name text
  var partnerLogo = function(h, maxW, fs){
    return logoUrl
      ? '<img src="'+logoUrl+'" style="height:'+h+';width:auto;max-width:160px;object-fit:contain;filter:'+(tpl===3?'none':'brightness(0) invert(1)')+'">'
      : '<span style="font-family:DM Sans,sans-serif;font-weight:700;color:'+t.text+';font-size:'+fs+'">'+firm+'</span>';
  };

  var tagEl = function(fs){
    return tagline ? '<div style="font-size:'+fs+';color:'+t.sub+';margin-top:3px">'+tagline+'</div>' : '';
  };

  var ctaBlock = function(fs, lineFs){
    var name = firm || 'your advisor';
    return '<div>'
      +'<div style="font-size:'+fs+';font-weight:700;color:'+t.text+'">Ready to resolve your tax debt?</div>'
      +'<div style="font-size:'+lineFs+';color:'+t.sub+';margin-top:5px">Speak with <span style="color:'+t.text+';font-weight:600">'+name+'</span> for a free referral to Community Tax.</div>'
      +'</div>';
  };

  // Headline variations by template
  var headlines = {
    1: { wide: 'Owe the IRS? <span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">There\'s a Way Out.</span>', square: 'You Don\'t Have to<br>Face the <span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">IRS Alone.</span>', tall: 'IRS Debt<br>Stealing Your<br><span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Peace of Mind?</span>' },
    2: { wide: 'Owe the IRS? <span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">There\'s a Way Out.</span>', square: 'You Don\'t Have to<br>Face the <span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">IRS Alone.</span>', tall: 'IRS Debt<br>Stealing Your<br><span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Peace of Mind?</span>' },
    3: { wide: 'Owe the IRS? <span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">There\'s a Way Out.</span>', square: 'You Don\'t Have to<br>Face the <span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">IRS Alone.</span>', tall: 'IRS Debt<br>Stealing Your<br><span style="background:linear-gradient(90deg,#0B5FD8,#00C8E0);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Peace of Mind?</span>' },
    4: { wide: 'Tax Debt? <span style="color:rgba(255,255,255,0.95)">We\'ve Resolved<br>$2.3 Billion.</span>', square: 'Stop the<br>IRS Before<br><span style="color:rgba(255,255,255,0.95)">They Stop You.</span>', tall: 'Take<br>Control<br>of Your<br><span style="color:rgba(255,255,255,0.95)">Tax Debt.</span>' },
    5: { wide: '<span style="color:'+brandColor+'">$2.3B</span> in Tax Debt<br>Resolved.', square: 'The IRS<br>Won\'t Wait.<br><span style="color:'+brandColor+'">Neither Should You.</span>', tall: 'Resolve<br>Your<br><span style="color:'+brandColor+'">Tax Debt</span><br>Today.' },
    6: { wide: 'Owe the IRS?<br><span style="color:'+brandColor+'">Get real help.</span>', square: 'Tax debt doesn\'t<br>fix itself.', tall: 'IRS<br>Resolution<br><span style="color:'+brandColor+'">Starts Here.</span>' }
  };
  var hl = headlines[tpl] || headlines[1];

  // Detect format
  var ratio = w / h;
  var fmt = ratio > 1.6 ? '16x9' : ratio > 1.1 ? '5x4' : Math.abs(ratio-1) < 0.15 ? '1x1' : ratio > 0.65 ? '4x5' : '9x16';

  var wrap = function(pad, content){
    return '<div style="width:100%;height:100%;background:'+t.bg+';font-family:DM Sans,sans-serif;box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:'+pad+'">'+content+'</div>';
  };
  var divider = function(h){ return '<div style="width:1px;height:'+h+';background:'+t.div+'"></div>'; };
  var eyebrow = function(fs){ return '<div style="font-size:'+fs+';font-weight:700;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,#a8b4c4,#d4dde8);background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1em">TAX DEBT RELIEF</div>'; };
  var ctaBtn = function(fs, pad, r, txt){
    return '<div style="background:'+t.ctaBg+';color:'+t.ctaText+';font-size:'+fs+';font-weight:700;padding:'+pad+';border-radius:'+r+';white-space:nowrap;text-align:center">'+txt+' →</div>';
  };
  var referral = function(fs, align){
    return '<div style="font-size:'+fs+';color:'+t.pill+';text-align:'+(align||'left')+'">Referred by '+firm+'</div>';
  };

  if(fmt === ‘16x9’){
    return wrap(‘26px 32px’,
      ‘<div style="display:flex;justify-content:space-between;align-items:center">’
        +’<div style="flex:1;min-width:0">’+partnerLogo(‘28px’,’’,’15px’)+tagEl(‘10px’)+’</div>’
        +’<div style="flex-shrink:0;display:flex;align-items:center;gap:8px">’+divider(‘20px’)+ctaxLogo(‘22px’)+’</div>’
      +’</div>’
      +’<div>’+eyebrow(‘9px’)
        +’<div style="font-family:DM Serif Display,serif;font-size:38px;line-height:1.08;color:’+t.text+’;letter-spacing:-0.02em">’+hl.wide+’</div>’
      +’</div>’
      +’<div>’
        +’<div style="font-size:13px;color:’+t.sub+’;line-height:1.5;margin-bottom:10px">$2.3B resolved. Confidential consultations. Real relief for real people.</div>’
        +ctaBlock(‘13px’,’12px’)
      +’</div>’
    );
  }

  if(fmt === '1x1'){
    return wrap('36px 40px',
      '<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="flex:1;min-width:0">'+partnerLogo('32px','','17px')+tagEl('12px')+'</div>'
        +'<div style="flex-shrink:0;display:flex;align-items:center;gap:10px">'+divider('24px')+ctaxLogo('26px')+'</div>'
      +'</div>'
      +'<div>'+eyebrow('11px')
        +’<div style="font-family:DM Serif Display,serif;font-size:52px;line-height:1.06;color:’+t.text+’;letter-spacing:-0.02em">’+hl.square+’</div>’
        +'<div style="font-size:16px;color:'+t.sub+';line-height:1.55;margin-top:20px;max-width:80%">120,000+ clients helped. No judgment. Real results.</div>'
      +'</div>'
      +ctaBlock('15px','13px')
    );
  }

  if(fmt === '4x5'){
    return wrap('40px 44px',
      '<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="flex:1;min-width:0">'+partnerLogo('30px','','16px')+tagEl('11px')+'</div>'
        +'<div style="flex-shrink:0">'+ctaxLogo('26px')+'</div>'
      +'</div>'
      +'<div>'+eyebrow('11px')
        +'<div style="font-family:DM Serif Display,serif;font-size:58px;line-height:1.06;color:'+t.text+';letter-spacing:-0.025em">'+hl.tall+'</div>'
        +'<div style="font-size:17px;color:'+t.sub+';line-height:1.6;margin-top:24px">We’ve helped 120,000+ clients resolve tax debt — quietly, legally, for less than you think.</div>'
      +'</div>'
      +ctaBlock('16px','14px')
    );
  }

  if(fmt === '9x16'){
    return wrap('56px 48px',
      '<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="flex:1;min-width:0">'+partnerLogo('36px','','18px')+tagEl('13px')+'</div>'
        +'<div style="flex-shrink:0">'+ctaxLogo('30px')+'</div>'
      +'</div>'
      +'<div>'+eyebrow('13px')
        +'<div style="font-family:DM Serif Display,serif;font-size:80px;line-height:1.04;color:'+t.text+';letter-spacing:-0.025em">'+hl.tall+'</div>'
        +'<div style="font-size:20px;color:'+t.sub+';line-height:1.65;margin-top:32px">We’ve helped 120,000+ clients resolve tax debt quietly and legally.</div>'
      +'</div>'
      +ctaBlock('20px','17px')
    );
  }

  // 5:4
  return wrap('32px 40px',
    '<div style="display:flex;justify-content:space-between;align-items:flex-start">'
      +'<div>'+partnerLogo('30px','','16px')+tagEl('11px')+'</div>'
      +'<div style="display:flex;align-items:center;gap:10px">'+divider('22px')+ctaxLogo('24px')+'</div>'
    +'</div>'
    +'<div>'+eyebrow('10px')
      +’<div style="font-family:DM Serif Display,serif;font-size:52px;line-height:1.07;color:’+t.text+’;letter-spacing:-0.02em">’+hl.wide+’</div>’
    +'</div>'
    +'<div>'
      +'<div style="font-size:14px;color:'+t.sub+';line-height:1.5;margin-bottom:10px">$2.3B resolved. Confidential. Real relief for real people.</div>'
      +ctaBlock('14px','12px')
    +'</div>'
  );
}


function downloadStaticAd(){
  var canvas = document.getElementById('am-ad-canvas');
  if(!canvas){ return; }
  if(typeof html2canvas === 'undefined'){
    var s = document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = function(){ runDownload(canvas); };
    document.head.appendChild(s);
  } else {
    runDownload(canvas);
  }
}

function runDownload(el){
  var firm = (document.getElementById('am-firm')||{value:'partner'}).value.trim() || 'partner';
  var realW = window._amRealW || 1200;
  var realH = window._amRealH || 628;
  // Lazy load html2canvas, then capture
  (window.loadHtml2Canvas ? window.loadHtml2Canvas() : Promise.resolve()).then(function(){
    html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    }).then(function(cv){
      var a = document.createElement('a');
      a.href = cv.toDataURL('image/png');
      a.download = firm.replace(/\s+/g,'-').toLowerCase() + '-ctax-' + realW + 'x' + realH + '.png';
      a.click();
    });
  });
}

function resetAdMaker(){
  var f = document.getElementById('am-form-wrap');
  var r = document.getElementById('am-results');
  if(f) f.style.display = 'block';
  if(r) r.style.display = 'none';
  amLogoDataUrl = null;
  var label = document.getElementById('am-logo-label');
  var drop  = document.getElementById('am-logo-drop');
  if(label) label.textContent = 'Click to upload PNG or SVG';
  if(drop){ drop.style.borderColor=''; drop.style.background=''; }
  var input = document.getElementById('am-logo-input');
  if(input){ input.value=''; input._wired=false; }
  setTimeout(function(){
    var i = document.getElementById('am-logo-input');
    if(i && !i._wired){
      i._wired=true;
      i.addEventListener('change', function(){
        var file=i.files&&i.files[0]; if(!file)return;
        var reader=new FileReader();
        reader.onload=function(e){
          amLogoDataUrl=e.target.result;
          var lbl=document.getElementById('am-logo-label');
          var drp=document.getElementById('am-logo-drop');
          if(lbl) lbl.textContent='✓ '+file.name;
          if(drp){ drp.style.borderColor='var(--blue)'; drp.style.background='rgba(11,95,216,0.04)'; }
        };
        reader.readAsDataURL(file);
      });
    }
  }, 100);
}
// ══════════════════════════════════════════
//  M2P1C2: Batch Ad Export (all sizes)
// ══════════════════════════════════════════

var AM_SIZES = [
  { label: 'Facebook / LinkedIn (16:9)', ratio: '16:9', w: 1200, h: 628 },
  { label: 'Instagram Square (1:1)', ratio: '1:1', w: 1080, h: 1080 },
  { label: 'Instagram Story (9:16)', ratio: '9:16', w: 1080, h: 1920 },
  { label: 'Pinterest (4:5)', ratio: '4:5', w: 1080, h: 1350 }
];

function amShowBatchExport() {
  var inputs = window._amInputs;
  if (!inputs || !inputs.firm) {
    if (typeof showToast === 'function') showToast('Generate an ad first to export all sizes.', 'warning');
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'am-batch-overlay';
  overlay.id = 'am-batch-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) amCloseBatchExport(); };

  var modal = document.createElement('div');
  modal.className = 'am-batch-modal';

  var html = '<div class="am-batch-header">';
  html += '<h3>Export All Ad Sizes</h3>';
  html += '<button class="am-batch-close" onclick="amCloseBatchExport()">&times;</button>';
  html += '</div>';
  html += '<div class="am-batch-body">';
  html += '<p class="am-batch-desc">Download your ad in every standard size. Each file is named with its dimensions.</p>';

  html += '<div class="am-batch-sizes">';
  AM_SIZES.forEach(function(s, i) {
    html += '<div class="am-batch-size-item">';
    html += '<div class="am-batch-size-label">' + s.label + '</div>';
    html += '<div class="am-batch-size-dim">' + s.w + 'x' + s.h + '</div>';
    html += '<div class="am-batch-size-status" id="am-batch-status-' + i + '">Ready</div>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div id="am-batch-progress" class="am-batch-progress" style="display:none">';
  html += '<div class="am-batch-progress-bar"><div class="am-batch-progress-fill" id="am-batch-fill"></div></div>';
  html += '</div>';

  html += '<div class="am-batch-actions">';
  html += '<button class="am-batch-btn-all" id="am-batch-run" onclick="amRunBatchExport()">Download All Sizes</button>';
  html += '</div>';
  html += '</div>';

  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function amCloseBatchExport() {
  var el = document.getElementById('am-batch-overlay');
  if (el) el.remove();
}

async function amRunBatchExport() {
  var inputs = window._amInputs;
  if (!inputs) return;

  var runBtn = document.getElementById('am-batch-run');
  if (runBtn) runBtn.disabled = true;
  var progressEl = document.getElementById('am-batch-progress');
  var fillEl = document.getElementById('am-batch-fill');
  if (progressEl) progressEl.style.display = 'block';

  // Create a temp container offscreen
  var temp = document.createElement('div');
  temp.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1';
  document.body.appendChild(temp);

  for (var i = 0; i < AM_SIZES.length; i++) {
    var s = AM_SIZES[i];
    var statusEl = document.getElementById('am-batch-status-' + i);
    if (statusEl) { statusEl.textContent = 'Generating...'; statusEl.style.color = '#0b5fd8'; }

    // Build the ad at this size
    var fmtMap = { '16:9': '16x9', '1:1': '1x1', '4:5': '4x5', '9:16': '9x16' };
    var fmt = fmtMap[s.ratio] || '16x9';
    var cardHtml = buildStaticCard(inputs.firm, inputs.platform || 'Facebook', inputs.color, inputs.tagline, amLogoDataUrl, amCurrentTemplate, { w: s.w, h: s.h });

    temp.innerHTML = '<div style="width:' + (s.w / 2) + 'px;height:' + (s.h / 2) + 'px;overflow:hidden">' + cardHtml + '</div>';

    try {
      if (typeof html2canvas !== 'undefined') {
        var canvas = await html2canvas(temp.firstChild, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null });
        var link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = inputs.firm.replace(/\s+/g, '-').toLowerCase() + '-ctax-' + s.w + 'x' + s.h + '.png';
        link.click();
        if (statusEl) { statusEl.textContent = 'Downloaded'; statusEl.style.color = '#059669'; }
      }
    } catch (err) {
      if (statusEl) { statusEl.textContent = 'Error'; statusEl.style.color = '#dc2626'; }
    }

    if (fillEl) fillEl.style.width = Math.round(((i + 1) / AM_SIZES.length) * 100) + '%';

    // Small delay between downloads
    await new Promise(function(resolve) { setTimeout(resolve, 500); });
  }

  temp.remove();
  if (runBtn) { runBtn.disabled = false; runBtn.textContent = 'Done!'; }
  if (typeof showToast === 'function') showToast('All ad sizes exported!', 'success');
}

// ── AI Platform Captions ─────────────────────────────────────

function generateCaptions() {
  var firm = (document.getElementById('am-firm') || {}).value || '';
  var platform = (document.getElementById('am-platform') || {}).value || 'Facebook';
  var tagline = (document.getElementById('am-tagline') || {}).value || '';
  var captionsWrap = document.getElementById('am-captions');
  var captionsList = document.getElementById('am-captions-list');
  if (!captionsWrap || !captionsList) return;

  captionsWrap.style.display = 'block';
  captionsList.innerHTML = '<div style="text-align:center;padding:20px;color:var(--slate)"><div class="spin" style="width:20px;height:20px;border:2px solid var(--off2);border-top-color:var(--blue);border-radius:50%;animation:spin .6s linear infinite;margin:0 auto 8px"></div>Generating captions...</div>';

  var prompt = 'You are a social media marketing expert for tax resolution services. '
    + 'Generate 3 ready-to-post social media captions for a co-branded ad between '
    + (firm ? '"' + firm + '"' : 'a tax professional') + ' and Community Tax (a tax resolution company). '
    + (tagline ? 'The firm tagline is: "' + tagline + '". ' : '')
    + 'Target platform: ' + platform + '. '
    + 'Each caption should: match the tone of ' + platform + ' (professional for LinkedIn, conversational for Facebook, punchy for Instagram), '
    + 'include a clear CTA, mention the partnership, and be ready to copy-paste. '
    + 'Return JSON array: [{"label":"Caption style name","text":"The full caption text","hashtags":"#relevant #hashtags"}]';

  var apiUrl = typeof CTAX_API_URL !== 'undefined' ? CTAX_API_URL : 'https://ctax-api-proxy.vercel.app/api/chat';
  fetch(apiUrl, {
    method: 'POST',
    headers: typeof getApiHeaders === 'function' ? getApiHeaders() : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
  })
  .then(function(r) {
    if (!r.ok) throw new Error('API returned ' + r.status);
    return r.json();
  })
  .then(function(data) {
    var text = data.content ? data.content[0].text : '';
    var captions = [];
    try {
      var match = text.match(/\[[\s\S]*\]/);
      if (match) captions = JSON.parse(match[0]);
    } catch (e) {
      console.warn('Caption parse error:', e.message);
    }
    if (!captions.length) {
      captions = [
        { label: 'Professional', text: 'Tax debt doesn\'t resolve itself. ' + (firm || 'Our firm') + ' has partnered with Community Tax to help clients find real solutions. Book a free consultation today.', hashtags: '#TaxRelief #TaxDebt #IRS' },
        { label: 'Empathetic', text: 'Owing the IRS is stressful. You don\'t have to face it alone. Through our partnership with Community Tax, we connect clients to proven tax resolution. DM us to learn more.', hashtags: '#TaxHelp #DebtFree #TaxResolution' },
        { label: 'Direct', text: '$2.3B in tax debt resolved. 120,000+ clients helped. ' + (firm || 'We') + ' + Community Tax = your path to IRS relief. Link in bio.', hashtags: '#TaxDebtRelief #IRSHelp #FinancialFreedom' }
      ];
    }
    renderCaptions(captions);
  })
  .catch(function(err) {
    console.error('Caption generation error:', err);
    captionsList.innerHTML = '<div style="color:#c0392b;font-size:14px">Failed to generate captions. Please try again.</div>';
  });
}

function renderCaptions(captions) {
  var list = document.getElementById('am-captions-list');
  if (!list) return;
  list.innerHTML = '';
  captions.forEach(function(c) {
    var card = document.createElement('div');
    card.style.cssText = 'background:var(--off);border:1px solid var(--off2);border-radius:8px;padding:14px 16px';
    var escaped = (c.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var hashtags = (c.hashtags || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
      + '<span style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--blue)">' + ((c.label || 'Caption').replace(/</g, '&lt;')) + '</span>'
      + '<button class="btn btn-s" style="font-size:11px;padding:4px 10px" onclick="copyCaptionText(this)">Copy</button>'
      + '</div>'
      + '<div class="am-caption-text" style="font-size:14px;color:var(--navy);line-height:1.6;white-space:pre-wrap">' + escaped + '</div>'
      + (hashtags ? '<div style="font-size:12px;color:var(--slate);margin-top:6px">' + hashtags + '</div>' : '');
    list.appendChild(card);
  });
}

function copyCaptionText(btn) {
  var card = btn.closest('.am-captions-list > div') || btn.parentElement.parentElement;
  var textEl = card.querySelector('.am-caption-text');
  if (!textEl) return;
  var hashEl = card.querySelector('div:last-child');
  var fullText = textEl.textContent;
  if (hashEl && hashEl !== textEl) fullText += '\n\n' + hashEl.textContent;
  navigator.clipboard.writeText(fullText).then(function() {
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
  });
}

// ── END AD MAKER ─────────────────────────────────────────────
