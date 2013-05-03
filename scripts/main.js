var DropTest = function(){
	var browserSupport = {
		filereader: typeof FileReader != 'undefined',
	  	dnd: 'draggable' in document.createElement('span'),
	  	// formdata: !!window.FormData,
	};
	
	var acceptedFileTypes = {
		'text/plain':true
	};
	
	var readTextFiles = function(files, callback){
		var fileOutput = async.map(files, function(file, callback){
			if(acceptedFileTypes[file.type]){
				var reader = new FileReader();
				reader.onload = (function() {
	           		callback(null, this.result);
	           })
	           reader.readAsText(file);
			}
			else{
				callback('Not a valid text file')
			}
			
		},function(err,result){
			callback(err, result)
		});
	}
	
	var parseAndSumNumbers = function(blobs){
		var sum = function(previousValue, currentValue){
		  	return parseFloat(previousValue) + parseFloat(currentValue);
		}
		return blobs.map(function(blob){
			return blob
				.match(/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/g)
				.reduce(sum);
		}).reduce(sum);
	}
	
	var registerDroppingEvents = function(){
		
		var stopDefaultEvents = function(e){
			e.preventDefault();
		    e.stopPropagation();
		}
		
		$(document).on({
			dragenter: stopDefaultEvents,
			dragover: function(e){
				stopDefaultEvents(e);
				$('.drop-zone').attr('class', 'drop-zone hover');
			},
			dragleave: function(){
				$('.drop-zone').attr('class', 'drop-zone');
			},
			drop: function(e){
				var files = e.originalEvent.dataTransfer.files;
				stopDefaultEvents(e);
				readTextFiles(files, function(err, results){
					if(!err) {
						var output = parseAndSumNumbers(results);
						$('.output').text(output);
					}else{
						alert(err);
					}
					
				});
			}
		}, '.drop-zone');
	}
	
	// Make sure it will work in the browser, could be iterated object over the browserSupport Obj...feeling lazy
	if(browserSupport.dnd && browserSupport.filereader){
		registerDroppingEvents();
	}
	else{
		$('<div class="error-overlay">Browser Not Supported. Use something cooler (like Chrome)</div>').appendTo(document.body);
	}
}();

