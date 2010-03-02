$.fn.markdown = function (preview) {
  var textarea = $(this).get(0);
  
  if (!preview) {
    preview = '#markdown_formatted'
  }

  var converter = new Showdown.converter;
  var render_container = null;
  
  var renderer = function(content) {
    if (!render_container) {
      var iframe = $('<iframe></iframe>', {
        css: { width: '100%', height: "100%"}
      }).appendTo('#markdown_formatted')
      
      iframe = iframe[0]
      render_container = iframe.document;    
      if(iframe.contentDocument)
          render_container = iframe.contentDocument; // For NS6
      else if(iframe.contentWindow)
          render_container = iframe.contentWindow.document; // For IE5.5 and IE6
    }

    // Put the content in the iframe
    render_container.open();
    render_container.writeln(content);
    render_container.close();
  }
  
  var converter_callback = function(value) {  
    renderer(converter.makeHtml(value));
  }

  var textarea = $(textarea).TextArea({
  	change: converter_callback
  });


  var toolbar = $.Toolbar(textarea, {
  	className: "markdown_toolbar"
  });  
  
  var setup_toolbar = function(toolbar) {

    //buttons  
    toolbar.addButton('Italics',function(){ 
        this.wrapSelection('*','*');  
    },{  
        id: 'markdown_italics_button'  
    });  

    toolbar.addButton('Bold',function(){  
        this.wrapSelection('**','**');  
    },{  
        id: 'markdown_bold_button'  
    });  

		toolbar.addButton('Link',function(){  
		    var selection = this.getSelection();  
		    var response = prompt('Enter Link URL','');  
		    if(response == null)  
		        return;  
		    this.replaceSelection('[' + (selection == '' ? 'Link Text' : selection) + '](' + (response == '' ? 'http://link_url/' : response).replace(/^(?!(f|ht)tps?:\/\/)/,'http://') + ')');  
		},{  
		    id: 'markdown_link_button'  
		});  


    toolbar.addButton('Image',function(){  
        var selection = this.getSelection();  
        var response = prompt('Enter Image URL','');  
        if(response == null)  
            return;  
        this.replaceSelection('![' + (selection == '' ? 'Image Alt Text' : selection) + '](' + (response == '' ? 'http://image_url/' : response).replace(/^(?!(f|ht)tps?:\/\/)/,'http://') + ')');  
    },{  
        id: 'markdown_image_button'  
    });  

    toolbar.addButton('Heading',function(){  
        var selection = this.getSelection() || 'Heading';
        if (selection == '') {
          selection = 'Heading';
        }

        for (var underscores = [], i = 0; i < Math.max(5,selection.length); i++) {
          underscores.push('-')
        }

        this.replaceSelection("\n" + selection + "\n" + underscores.join(''));  
    },{  
        id: 'markdown_heading_button'  
    });  

    toolbar.addButton('Unordered List',function(event){  
        this.collectFromEachSelectedLine(function(line){  
            return event.shiftKey ? (line.match(/^\*{2,}/) ? line.replace(/^\*/,'') : line.replace(/^\*\s/,'')) : (line.match(/\*+\s/) ? '*' : '* ') + line;  
        });  
    },{  
        id: 'markdown_unordered_list_button'  
    });  

    toolbar.addButton('Ordered List',function(event){  
        var i = 0;  
        this.collectFromEachSelectedLine(function(line){  
            if(!line.match(/^\s+$/)){  
                ++i;  
                return event.shiftKey ? line.replace(/^\d+\.\s/,'') : (line.match(/\d+\.\s/) ? '' : i + '. ') + line;  
            }  
        });  
    },{  
        id: 'markdown_ordered_list_button'  
    });  

    toolbar.addButton('Block Quote',function(event){  
        this.collectFromEachSelectedLine(function(line){  
            return event.shiftKey ? line.replace(/^\> /,'') : '> ' + line;  
        });  
    },{  
        id: 'markdown_quote_button'  
    });  

    toolbar.addButton('Code Block',function(event){  
        this.collectFromEachSelectedLine(function(line){  
            return event.shiftKey ? line.replace(/    /,'') : '    ' + line;  
        });  
    },{  
        id: 'markdown_code_button'  
    });  

    toolbar.addButton('Help',function(){  
        window.open('http://daringfireball.net/projects/markdown/dingus');  
    },{  
        id: 'markdown_help_button'  
    });

  }
  
  setup_toolbar(toolbar)
}
