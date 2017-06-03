"use strict"

var express = require('express')
var bodyParser = require('body-parser')
var compression = require('compression')
var jsonPromise = require('jsonfile-promised')
var fsPromise = require('fs-promise')

const WEBPACK_CHUNKS = 'webpack_js_chunks.json'
const LOCAL_PORT = 5000


function logExpressErrors(e, req, res, next) {
  global.Method_logger.chronicle('error', 'express-error', module.filename, ' e.stack', e.stack)
  next(e)
}

function expressErrorHandler(e, req, res, _next) {
  res.status(500)
  res.send('SERVER ERROR')
}

function chunkhashEntry(bundle_name, req) {
  const host_url = req.headers.host
  return jsonPromise.readFile(WEBPACK_CHUNKS)
          .then(js_file_parts => {
            const js_bundle = js_file_parts[bundle_name]['js']
            const chunkhash_url = '//' + host_url + '/' + js_bundle
            return chunkhash_url
          })
          .catch(err => console.error(err))
}

function readResourceFile(public_static_files, resource_path) {
  const file_contents = fsPromise.readFile(public_static_files + resource_path, 'utf8')
  return file_contents
}

function readEntryJsx(gmap_jsx) {
  const file_contents = fsPromise.readFile('webpack-entry/' + gmap_jsx, 'utf8')
  return file_contents
}

function commonJsIncludes() {
  var common_js = ` <script DEFER src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.js"></script>
                    <script DEFER src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.js"></script>
					<script DEFER src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js"></script><!-- for IE symbol -->
					<script DEFER src="canvasPolyfill.js"> // for IE canvas.Path2D </script>`
   return common_js
}

function html2Text(a_string_1) {
  const a_string_2 = a_string_1.replace(/</g, '&lt;')
  const a_string_3 = a_string_2.replace(/>/g, '&gt;')
  return a_string_3
}

let web_server = function (public_static_files, resource_folder, localhost_port) {
  var app = express()
  app.use(compression())
  app.use(express.static(public_static_files, {maxAge: '1y'}))
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(logExpressErrors)
  app.use(expressErrorHandler)
  let resource_location = public_static_files + '/' + resource_folder + '/'

  app.get('/simple', function (req, res) {
    let gmap_simple_entry = chunkhashEntry('gmap_simple_entry', req)
    let common_js_include = chunkhashEntry('commons', req)
    let simple_html = readResourceFile(resource_location, 'simple/simple.html')
    let simple_pre_jsx = readEntryJsx('gmap_simple_entry.jsx')
    let simple_pre_js = readResourceFile(resource_location, 'simple/gmap_simple.js')
    let simple_promises = [gmap_simple_entry, common_js_include, simple_html, simple_pre_jsx, simple_pre_js]
    return Promise.all(simple_promises)
            .then(([gmap_simple_entry, common_js_include, simple_html, simple_pre_jsx, simple_pre_js]) => {
              const react_includes = commonJsIncludes()
              const simple_pre_jsx_text = html2Text(simple_pre_jsx)
              const simple_page = `<!doctype html>
                             <html lang="en-US">
                                <title>Simple</title>
								<body>
								<link rel="stylesheet" type="text/css" href="shared_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/simple/simple_styles.css">
									${react_includes}      
									<script DEFER src="${common_js_include}"></script>									
										${simple_html}
									<script DEFER src="${gmap_simple_entry}"></script>
										<script DEFER src="gmap-resources/simple/gmap_simple.js"></script>
									<pre>${simple_pre_jsx_text}</pre>
									<pre>${simple_pre_js}</pre>
                               </body>
                             </html>`
              res.send(simple_page)
            })
  })

  app.get('/dynamic', function (req, res) {
    let gmap_dynamic_entry = chunkhashEntry('gmap_dynamic_entry', req)
    let common_js_include = chunkhashEntry('commons', req)
    let dynamic_html = readResourceFile(resource_location, 'dynamic_map/dynamic.html')
    let dynamic_pre_jsx = readEntryJsx('gmap_dynamic_entry.jsx')
    let dynamic_pre_js = readResourceFile(resource_location, 'dynamic_map/gmap_dynamic.js')
    let dynamic_promises = [gmap_dynamic_entry, common_js_include, dynamic_html, dynamic_pre_jsx, dynamic_pre_js]
    return Promise.all(dynamic_promises)
            .then(([gmap_dynamic_entry, common_js_include, dynamic_html, dynamic_pre_jsx, dynamic_pre_js]) => {
              const react_includes = commonJsIncludes()
              const dynamic_pre_jsx_text = html2Text(dynamic_pre_jsx)
              const dynamic_page = `<!doctype html>
                             <html lang="en-US">
                                <title>Dynamic</title>
								<body>
								<link rel="stylesheet" type="text/css" href="shared_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/dynamic_map/dynamic_styles.css">
									${react_includes}      
									<script DEFER  src="${common_js_include}"></script>									
									<script DEFER src="${gmap_dynamic_entry}"></script>
									<script DEFER src="gmap-resources/dynamic_map/gmap_dynamic.js"></script>
										${dynamic_html}
									<pre>${dynamic_pre_jsx_text}</pre>
									<pre>${dynamic_pre_js}</pre>
								
                               </body>
                             </html>`
              res.send(dynamic_page)
            })
  })

  app.get('/activities', function (req, res) {
    let gmap_activities_entry = chunkhashEntry('gmap_activities_entry', req)
    let common_js_include = chunkhashEntry('commons', req)
    let activities_html = readResourceFile(resource_location, 'activities/activities.html')
    let activities_pre_jsx = readEntryJsx('gmap_activities_entry.jsx')
    let activities_pre_js = readResourceFile(resource_location, 'activities/gmap_activities.js')
    let activities_pre_data = readEntryJsx('activities_data.jsx')
    let activities_promises = [gmap_activities_entry, common_js_include, activities_html, activities_pre_jsx, activities_pre_js, activities_pre_data]
    return Promise.all(activities_promises)
            .then(([gmap_activities_entry, common_js_include, activities_html,  activities_pre_jsx, activities_pre_js, activities_pre_data]) => {
              const activities_pre_jsx_text = html2Text(activities_pre_jsx)
              const react_includes = commonJsIncludes()
              const dynamic_page = `<!doctype html>
                             <html lang="en-US">
                             <title>Activities</title>
								<body>
								<link rel="stylesheet" type="text/css" href="shared_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/activities/activities_styles.css">
									${react_includes}      
									<script DEFER src="${common_js_include}"></script>	
                                    ${activities_html}
									<script DEFER src="${gmap_activities_entry}"></script>
									<script DEFER src="gmap-resources/activities/gmap_activities.js"></script>
									<pre>${activities_pre_jsx_text}</pre>
									<pre>${activities_pre_js}</pre>
									<pre>${activities_pre_data}</pre>
                               </body>
                             </html>`
              res.send(dynamic_page)
            })
  })

  app.get('/', function (req, res) {
    let common_js_include = chunkhashEntry('commons', req)
    let gmap_dynamic_entry = chunkhashEntry('gmap_dynamic_entry', req)
    let gmap_simple_entry = chunkhashEntry('gmap_simple_entry', req)
    let gmap_activities_entry = chunkhashEntry('gmap_activities_entry', req)
    let gmap_malls_entry = chunkhashEntry('gmap_malls_entry', req)
    let gmap_hike_entry = chunkhashEntry('gmap_hike_entry', req)
    let gmap_events_entry = chunkhashEntry('gmap_events_entry', req)
    let dynamic_html = readResourceFile(resource_location, 'dynamic_map/dynamic.html')
    let simple_html = readResourceFile(resource_location, 'simple/simple.html')
    let activities_html = readResourceFile(resource_location, 'activities/activities.html')
    let malls_html = readResourceFile(resource_location, 'malls/malls.html')
    let hike_html = readResourceFile(resource_location, 'hike/hike.html')
    let event_html = readResourceFile(resource_location, 'events/events.html')
    let my_promises = [common_js_include,
      gmap_dynamic_entry, gmap_simple_entry, gmap_activities_entry, gmap_malls_entry, gmap_hike_entry,gmap_events_entry,
      dynamic_html, simple_html, activities_html, malls_html, hike_html,event_html]
    return Promise.all(my_promises)
            .then(([common_js_include,
              gmap_dynamic_entry, gmap_simple_entry, gmap_activities_entry, gmap_malls_entry, gmap_hike_entry,gmap_events_entry,
              dynamic_html, simple_html, activities_html, malls_html, hike_html,event_html]) => {
              const react_includes = commonJsIncludes()
              const dynamic_page = `<!doctype html>
                             <html lang="en-US">
                                <title>All</title>
								<body>
								<link rel="stylesheet" type="text/css" href="shared_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/dynamic_map/dynamic_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/malls/malls_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/activities/activities_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/hike/hike_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/events/events_styles.css">
									${simple_html} 
									 <a href='/simple'>single page</a> 
								<hr>
									${malls_html}
									<div style='clear:both'>&nbsp;</div>
									<a href='/malls'>single page</a>
								<hr>
									 ${dynamic_html} 
								 	<a href='/dynamic'>single page</a>
								<hr>
								    ${activities_html}
									<a href='/activities'>single page</a>
								<hr>
									${hike_html}
								 	<a href='/hikes'>single page</a>
								<hr>
									${event_html}
								 	<a href='/events'>single page</a>
     							${react_includes}      
								<script DEFER src="${common_js_include}"></script>	
								<script DEFER src="${gmap_dynamic_entry}"></script>
								<script DEFER src="${gmap_simple_entry}"></script>
								<script DEFER src="${gmap_activities_entry}"></script>
								<script DEFER src="${gmap_malls_entry}"></script>
								<script DEFER src="${gmap_hike_entry}"></script>
								<script DEFER src="${gmap_events_entry}"></script>
								<script DEFER  src="gmap-resources/hike/gmap_hike.js"></script>
								<script DEFER  src="gmap-resources/malls/gmap_malls.js"></script>
								<script DEFER  src="gmap-resources/dynamic_map/gmap_dynamic.js"></script>
								<script DEFER src="gmap-resources/simple/gmap_simple.js"></script>
								<script DEFER src="gmap-resources/activities/gmap_activities.js"></script>
								<script DEFER src="gmap-resources/events/gmap_events.js"></script>
                               </body>
                             </html>`
              res.send(dynamic_page)
            })
  })

  app.get('/hikes', function (req, res) {
    let gmap_hike_entry = chunkhashEntry('gmap_hike_entry', req)
    let common_js_include = chunkhashEntry('commons', req)
    let hike_html = readResourceFile(resource_location, 'hike/hike.html')
    let hike_pre_jsx = readEntryJsx('gmap_hike_entry.jsx')
    let hike_pre_js = readResourceFile(resource_location, 'hike/gmap_hike.js')
    let hike_pre_data = readEntryJsx('hikes_data.jsx')
    let hike_promises = [gmap_hike_entry, common_js_include, hike_html, hike_pre_jsx, hike_pre_js, hike_pre_data]
    return Promise.all(hike_promises)
            .then(([gmap_hike_entry, common_js_include, hike_html, hike_pre_jsx, hike_pre_js, hike_pre_data]) => {
              const react_includes = commonJsIncludes()
              const hike_pre_jsx_text = html2Text(hike_pre_jsx)
              const hike_page = `<!doctype html>
                             <html lang="en-US">
                                <title>hike</title>
								<body>
								<link rel="stylesheet" type="text/css" href="shared_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/hike/hike_styles.css">
									${hike_html}
									${react_includes}      
									<script DEFER src="${common_js_include}"></script>									
									<script DEFER src="${gmap_hike_entry}"></script>
									<pre>${hike_pre_jsx_text}</pre>
									<pre>${hike_pre_js}</pre>
									<pre>${hike_pre_data}</pre>
									<script DEFER src="gmap-resources/hike/gmap_hike.js"></script>
                               </body>
                             </html>`
              res.send(hike_page)
            })
  })

  app.get('/malls', function (req, res) {
    let gmap_malls_entry = chunkhashEntry('gmap_malls_entry', req)
    let common_js_include = chunkhashEntry('commons', req)
    let malls_html = readResourceFile(resource_location, 'malls/malls.html')
    let malls_pre_jsx = readEntryJsx('gmap_malls_entry.jsx')
    let malls_pre_js = readResourceFile(resource_location, 'malls/gmap_malls.js')
    let malls_pre_data = readEntryJsx('malls_data.jsx')
    let malls_promises = [gmap_malls_entry, common_js_include, malls_html, malls_pre_jsx, malls_pre_js, malls_pre_data]
    return Promise.all(malls_promises)
            .then(([gmap_malls_entry, common_js_include, malls_html, malls_pre_jsx, malls_pre_js, malls_pre_data]) => {
              const react_includes = commonJsIncludes()
              const malls_pre_jsx_text = html2Text(malls_pre_jsx)
              const malls_page = `<!doctype html>
                             <html lang="en-US">
                                <title>malls</title>
								<body>
								<link rel="stylesheet" type="text/css" href="shared_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/malls/malls_styles.css">
									${malls_html}
									${react_includes}      
									<script DEFER src="${common_js_include}"></script>									
									<script DEFER src="${gmap_malls_entry}"></script>
									<script DEFER src="gmap-resources/malls/gmap_malls.js"></script>
									<pre>${malls_pre_jsx_text}</pre>
                                    <pre>${malls_pre_js}</pre>
                                    <pre>${malls_pre_data}</pre>
                               </body>
                             </html>`
              res.send(malls_page)
            })
  })

  app.get('/events', function (req, res) {
    let gmap_events_entry = chunkhashEntry('gmap_events_entry', req)
    let common_js_include = chunkhashEntry('commons', req)
    let events_html = readResourceFile(resource_location, 'events/events.html')
    let events_pre_jsx = readEntryJsx('gmap_events_entry.jsx')
    let events_pre_js = readResourceFile(resource_location, 'events/gmap_events.js')
    let events_promises = [gmap_events_entry, common_js_include, events_html, events_pre_jsx, events_pre_js]
    return Promise.all(events_promises)
            .then(([gmap_events_entry, common_js_include, events_html, events_pre_jsx, events_pre_js]) => {
              const react_includes = commonJsIncludes()
              const events_pre_jsx_text = html2Text(events_pre_jsx)
              const events_page = `<!doctype html>
                             <html lang="en-US">
                                <title>events</title>
								<body>
								<link rel="stylesheet" type="text/css" href="shared_styles.css">
								<link rel="stylesheet" type="text/css" href="gmap-resources/events/events_styles.css">
									${events_html}
									${react_includes}      
									<script DEFER src="${common_js_include}"></script>									
									<script DEFER src="${gmap_events_entry}"></script>
									<script DEFER src="gmap-resources/events/gmap_events.js"></script>
									<pre>${events_pre_jsx_text}</pre>
                                    <pre>${events_pre_js}</pre>
                               </body>
                             </html>`
              res.send(events_page)
            })
  })



  app.get('*', function (req, res) {
    res.redirect('/')
  })

  app.set('port', (process.env.PORT || localhost_port))
  var node_port = app.get('port')
  app.listen(node_port).on('error', function (e) {
    console.log(e)
    process.exit()
  })
  return app

}

console.log(`http://localhost:${LOCAL_PORT}`)
web_server('public', 'gmap-resources', LOCAL_PORT)
















