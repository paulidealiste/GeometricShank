const electron = window.require("electron");
import GeometricShankToolbar from './GeometricShankToolbar.component';
import GeometricShankWindow from './GeometricShankWindow.component';
import * as UIkit from 'uikit';
import * as R from 'ramda';
import * as elementResizeDetectorMaker from 'element-resize-detector';

export default ({
  template: `
  <div class="uk-flex uk-flex-column uk-height-viewport">
    <nav class="uk-navbar-container geometric-shank-navbar" uk-navbar>
      <div class="uk-navbar-left">
          <div class="uk-navbar-item uk-logo">
            <img class="cutupLogo" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iNTguODQ0OTk0bW0iCiAgIGhlaWdodD0iNTMuMTE2MjhtbSIKICAgdmlld0JveD0iMCAwIDU4Ljg0NDk5NCA1My4xMTYyOCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnODQ4IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjIgNWMzZTgwZCwgMjAxNy0wOC0wNiIKICAgc29kaXBvZGk6ZG9jbmFtZT0iY3V0dXBsb2dvLnN2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczg0MiI+CiAgICA8Y2xpcFBhdGgKICAgICAgIGNsaXBQYXRoVW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImNsaXBQYXRoNjg0OCI+CiAgICAgIDxyZWN0CiAgICAgICAgIHk9IjI3Ljg5ODY2OCIKICAgICAgICAgeD0iNzUuMjY0NTAzIgogICAgICAgICBoZWlnaHQ9IjUyLjA5NTI2MSIKICAgICAgICAgd2lkdGg9IjI4LjQ5MzUwNyIKICAgICAgICAgaWQ9InJlY3Q2ODUwIgogICAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC41ODI1MTMyNztzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogICAgPC9jbGlwUGF0aD4KICAgIDxjbGlwUGF0aAogICAgICAgY2xpcFBhdGhVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0iY2xpcFBhdGg2ODQ0Ij4KICAgICAgPHJlY3QKICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNTQ0NTczNDM7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgaWQ9InJlY3Q2ODQ2IgogICAgICAgICB3aWR0aD0iMjQuOTAyNzMxIgogICAgICAgICBoZWlnaHQ9IjUyLjA5NTI2MSIKICAgICAgICAgeD0iMTAzLjk5MDciCiAgICAgICAgIHk9IjI3Ljg5ODY2OCIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8Y2xpcFBhdGgKICAgICAgIGNsaXBQYXRoVW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImNsaXBQYXRoMTQ1MyI+CiAgICAgIDxyZWN0CiAgICAgICAgIHk9IjI3Ljg5ODY2OCIKICAgICAgICAgeD0iNzUuMjY0NTAzIgogICAgICAgICBoZWlnaHQ9IjUyLjA5NTI2MSIKICAgICAgICAgd2lkdGg9IjI4LjQ5MzUwNyIKICAgICAgICAgaWQ9InJlY3QxNDUxIgogICAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC41ODI1MTMyNztzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogICAgPC9jbGlwUGF0aD4KICAgIDxjbGlwUGF0aAogICAgICAgY2xpcFBhdGhVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0iY2xpcFBhdGgxNDU3Ij4KICAgICAgPHJlY3QKICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNTQ0NTczNDM7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgaWQ9InJlY3QxNDU1IgogICAgICAgICB3aWR0aD0iMjQuOTAyNzMxIgogICAgICAgICBoZWlnaHQ9IjUyLjA5NTI2MSIKICAgICAgICAgeD0iMTAzLjk5MDciCiAgICAgICAgIHk9IjI3Ljg5ODY2OCIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8Y2xpcFBhdGgKICAgICAgIGNsaXBQYXRoVW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgaWQ9ImNsaXBQYXRoMTQ2MSI+CiAgICAgIDxyZWN0CiAgICAgICAgIHk9IjI3Ljg5ODY2OCIKICAgICAgICAgeD0iNzUuMjY0NTAzIgogICAgICAgICBoZWlnaHQ9IjUyLjA5NTI2MSIKICAgICAgICAgd2lkdGg9IjI4LjQ5MzUwNyIKICAgICAgICAgaWQ9InJlY3QxNDU5IgogICAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC41ODI1MTMyNztzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogICAgPC9jbGlwUGF0aD4KICAgIDxjbGlwUGF0aAogICAgICAgY2xpcFBhdGhVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBpZD0iY2xpcFBhdGgxNDY1Ij4KICAgICAgPHJlY3QKICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNTQ0NTczNDM7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgaWQ9InJlY3QxNDYzIgogICAgICAgICB3aWR0aD0iMjQuOTAyNzMxIgogICAgICAgICBoZWlnaHQ9IjUyLjA5NTI2MSIKICAgICAgICAgeD0iMTAzLjk5MDciCiAgICAgICAgIHk9IjI3Ljg5ODY2OCIgLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0iYmFzZSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp6b29tPSIwLjk4OTk0OTQ5IgogICAgIGlua3NjYXBlOmN4PSIyMDEuNDM5MTgiCiAgICAgaW5rc2NhcGU6Y3k9IjE3NS40ODczNSIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBmaXQtbWFyZ2luLXRvcD0iMCIKICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiCiAgICAgZml0LW1hcmdpbi1yaWdodD0iMCIKICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEzNjYiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNzA2IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIzNCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTg0NSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0LjMzMzgyMSwtMzYuNTkzNTUyKSI+CiAgICA8ZwogICAgICAgaWQ9ImcxNTU1Ij4KICAgICAgPGcKICAgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU3LjU1MTM0MSwxMC43MzYyNDQpIgogICAgICAgICBjbGlwLXBhdGg9InVybCgjY2xpcFBhdGg2ODQ0KSIKICAgICAgICAgaWQ9Imc2ODI0Ij4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjAuOTtmaWxsOiNmZjY2NjY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMzMzMzMzM7c3Ryb2tlLXdpZHRoOjAuNTI5MTY2NjQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgICBpZD0icmVjdDYyMTEiCiAgICAgICAgICAgd2lkdGg9IjM1LjI3OTU3NSIKICAgICAgICAgICBoZWlnaHQ9IjM1LjI3OTU3NSIKICAgICAgICAgICB4PSI3Ni4xOTQwOTIiCiAgICAgICAgICAgeT0iMjguOTk0NTQ1IiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MC45O2ZpbGw6I2ZmNjY2NjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzMzMzMzMztzdHJva2Utd2lkdGg6MC41MjkxNjY2NDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICAgIGlkPSJyZWN0NjIxMyIKICAgICAgICAgICB3aWR0aD0iMzUuMjc5NTc1IgogICAgICAgICAgIGhlaWdodD0iMzUuMjc5NTc1IgogICAgICAgICAgIHg9IjkyLjc2NDgwMSIKICAgICAgICAgICB5PSI0My40MjcxMDEiIC8+CiAgICAgIDwvZz4KICAgICAgPGcKICAgICAgICAgY2xpcC1wYXRoPSJ1cmwoI2NsaXBQYXRoNjg0OCkiCiAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MS41OTU2ODcsNy44NjM1OTA4KSIKICAgICAgICAgaWQ9Imc2ODQwIj4KICAgICAgICA8cmVjdAogICAgICAgICAgIHk9IjI4Ljk5NDU0NSIKICAgICAgICAgICB4PSI3Ni4xOTQwOTIiCiAgICAgICAgICAgaGVpZ2h0PSIzNS4yNzk1NzUiCiAgICAgICAgICAgd2lkdGg9IjM1LjI3OTU3NSIKICAgICAgICAgICBpZD0icmVjdDY4MzYiCiAgICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MC45O2ZpbGw6I2ZmNjY2NjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzMzMzMzMztzdHJva2Utd2lkdGg6MC41MjkxNjY2NDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgeT0iNDMuNDI3MTAxIgogICAgICAgICAgIHg9IjkyLjc2NDgwMSIKICAgICAgICAgICBoZWlnaHQ9IjM1LjI3OTU3NSIKICAgICAgICAgICB3aWR0aD0iMzUuMjc5NTc1IgogICAgICAgICAgIGlkPSJyZWN0NjgzOCIKICAgICAgICAgICBzdHlsZT0ib3BhY2l0eTowLjk7ZmlsbDojZmY2NjY2O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMzMzMzMzO3N0cm9rZS13aWR0aDowLjUyOTE2NjY0O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+CiAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxnCiAgICAgICBpZD0iZzE1NjMiCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzIuODU4Mzc0LDAuMDAyMzI2OTUpIj4KICAgICAgPGcKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZiYjgyOTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2Q0MDAwMDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICBpZD0iZzY4NTYiCiAgICAgICAgIGNsaXAtcGF0aD0idXJsKCNjbGlwUGF0aDY4NDQpIgogICAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIuMjcxNzY5LDEwLjczNjI0NCkiPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgeT0iMjguOTk0NTQ1IgogICAgICAgICAgIHg9Ijc2LjE5NDA5MiIKICAgICAgICAgICBoZWlnaHQ9IjM1LjI3OTU3NSIKICAgICAgICAgICB3aWR0aD0iMzUuMjc5NTc1IgogICAgICAgICAgIGlkPSJyZWN0Njg1MiIKICAgICAgICAgICBzdHlsZT0ib3BhY2l0eTowLjk7ZmlsbDojZmJiODI5O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZDQwMDAwO3N0cm9rZS13aWR0aDowLjUyOTE2NjY0O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+CiAgICAgICAgPHJlY3QKICAgICAgICAgICB5PSI0My40MjcxMDEiCiAgICAgICAgICAgeD0iOTIuNzY0ODAxIgogICAgICAgICAgIGhlaWdodD0iMzUuMjc5NTc1IgogICAgICAgICAgIHdpZHRoPSIzNS4yNzk1NzUiCiAgICAgICAgICAgaWQ9InJlY3Q2ODU0IgogICAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjAuOTtmaWxsOiNmYmI4Mjk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNkNDAwMDA7c3Ryb2tlLXdpZHRoOjAuNTI5MTY2NjQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4KICAgICAgPC9nPgogICAgICA8ZwogICAgICAgICBzdHlsZT0iZmlsbDojZmJiODI5O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojZDQwMDAwO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgIGlkPSJnNjg2MiIKICAgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2LjMxNjExNCw3Ljg2MzU5MikiCiAgICAgICAgIGNsaXAtcGF0aD0idXJsKCNjbGlwUGF0aDY4NDgpIj4KICAgICAgICA8cmVjdAogICAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjAuOTtmaWxsOiNmYmI4Mjk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNkNDAwMDA7c3Ryb2tlLXdpZHRoOjAuNTI5MTY2NjQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgICBpZD0icmVjdDY4NTgiCiAgICAgICAgICAgd2lkdGg9IjM1LjI3OTU3NSIKICAgICAgICAgICBoZWlnaHQ9IjM1LjI3OTU3NSIKICAgICAgICAgICB4PSI3Ni4xOTQwOTIiCiAgICAgICAgICAgeT0iMjguOTk0NTQ1IiAvPgogICAgICAgIDxyZWN0CiAgICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MC45O2ZpbGw6I2ZiYjgyOTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2Q0MDAwMDtzdHJva2Utd2lkdGg6MC41MjkxNjY2NDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICAgIGlkPSJyZWN0Njg2MCIKICAgICAgICAgICB3aWR0aD0iMzUuMjc5NTc1IgogICAgICAgICAgIGhlaWdodD0iMzUuMjc5NTc1IgogICAgICAgICAgIHg9IjkyLjc2NDgwMSIKICAgICAgICAgICB5PSI0My40MjcxMDEiIC8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=">
          </div>
          <ul class="uk-navbar-nav">
            <li class="uk-active">
                 <a href="#">
                     <div>
                         <span class="uk-text-bold">Geometric shank</span>
                         <div class="uk-navbar-subtitle">Cut-up method spike</div>
                     </div>
                 </a>
             </li>
          </ul>
      </div>
    </nav>
    <div class="uk-flex">
      <geometric-shank-toolbar v-bind:current-victim="currentVictim"
        v-on:scv="setCurrentVictim" 
        v-on:nex="newRandomExcrept" 
        v-on:cal="clearAll" 
        v-on:ccu="clearCutupExcrept" 
        v-on:ctg="cutTextGeometrically" 
        v-on:pra="pasteCutUpSegments" 
        v-on:sse="showSegments" 
        v-on:pcu="printCutup"
        v-on:frh="manageFreehandMode"></geometric-shank-toolbar>
    </div>
    <div class="uk-flex uk-flex-1">
      <geometric-shank-window ref="gsw"></geometric-shank-window>
    </div>
  </div>
  `,
  data: function () {
    return {
      currentVictim: 'Critique of pure reason',
      erd: elementResizeDetectorMaker(),
      erdActive: false
    }
  },
  methods: {
    newRandomExcrept: function () {
      this.$refs.gsw.newRandomExcrept(this.currentVictim);
    },
    cutTextGeometrically: function () {
      this.$refs.gsw.cutTextGeometrically();
    },
    pasteCutUpSegments: function () {
      this.$refs.gsw.pasteCutUpSegments();
    },
    clearCutupExcrept: function () {
      this.$refs.gsw.clearCutupExcrept();
    },
    clearAll: function () {
      this.$refs.gsw.clearAll();
    },
    showSegments: function () {
      this.$refs.gsw.showSegments();
    },
    printCutup: function () {
      this.$refs.gsw.printCutup();
    },
    manageFreehandMode: function (freehand) {
      this.$refs.gsw.manageFreehandMode(freehand);
    },
    setCurrentVictim: function () {
      electron.ipcRenderer.send('openAndStoreFile');
      electron.ipcRenderer.on('newVictimFileStored', (event, arg) => {
        this.currentVictim = arg;
        let trans = this.$t("components.dialogs.currentvictimsucess") + '<br>' + arg;
        let noty = R.once(UIkit.notification('<span uk-icon="icon: check"></span><span class="uk-text-small uk-position-center">' + trans + '</span>'));
      });
    },
    resizeWindow: function () {
      if (!this.erdActive) {
        this.erdActive = true;
      } else {
        this.$nextTick(function () {
          this.$refs.gsw.resizeListener();
        });
      }
    }
  },
  mounted: function () {
    this.erd.listenTo(this.$el, this.resizeWindow);
  },
  components: {
    'geometric-shank-toolbar': GeometricShankToolbar,
    'geometric-shank-window': GeometricShankWindow
  }
})
