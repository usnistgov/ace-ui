# General information
This guide lists the usage of how to use the ACE application for monitoring and controlling video streams and analytics. 

# User interface Guide
The user interface application consist of the following parts:
1. Configuration page
1. Dashboard Page
1. Stream details page


## Configuration Page
![2021-05-11_14-12-37](data/config_page.png?raw=true)

The configuration page allows the user to link analytics to a stream. To go to the configuration page, click Configure on the left sidebar of the page.

To link a video stream to analytics, fill out the fields for Stream Source (video source), analytics address ( Analytics that should run on a video), and optionally tags. 

The form has the option to use a custom video source. The custom source is useful when you have a streaming video URL which could be an RTSP or MJPG stream. To add a custom source, toggle “Use custom stream source” and add the URL address of the video.

After submitting the configuration form, if the configuration was successful you should see a green alert message pop up on the bottom of the screen. Otherwise, there will be a red alert message with detailed error messages.

## Dashboard Page

![2021-05-11_13-49-10](data/dashboard_page.png?raw=true)
The dashboard gives an overview of the ACE system. The dashboard page offers ways to see and configure notifications and buttons to view detailed information about streams and analytics. 


##### Overview Sections
This section of the dashboard is useful to get a glance at the system. The overview section is the very first row of the dashboard page. The section shows analytics, streams, and any unread notifications from the system.

##### Running streams and analytics section:
This section allows user to 
- configure notifications
- view the notifications configuration 
- see notifications 
- go to a detailed view of a stream

To configure notifications, click on the settings icon, this should bring up a popup window where you could select notifications and add comma-separated objects to be notified on.

The configuration is viewable next to the settings icon with the analytics name and the object name.

If any notifications match the notification settings, the notifications bell icon will have a number indicating the number of notifications. 

The details of the notifications and the stream running are viewable by clicking the notifications icon. 


## Stream Details Page:
The stream details page is useful to get a detailed view of a stream and all the analytics running on the stream. Clicking on the notifications bell icon will take the user to the stream details page.

The stream page has the option to remove analytics from a stream by clicking on the delete button.

There are viewing options to show all objects, notification objects, and raw data via the options radio form. 

1. All objects show all the items detected by an analytic
1. Notification objects show items configured by the notification menu
1. Raw data shows a textual representation of the data coming to the UI, this could be useful to read metrics data from analytics
