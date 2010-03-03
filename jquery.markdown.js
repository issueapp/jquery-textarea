(function () {
  var markdown = {
    // singleton preview iframe
    preview: null,

    // showdown converter
    converter: new Showdown.converter,

    init: function (textarea, preview) {
      if (!markdown.preview && preview) {
        var iframe = $('<iframe/>').appendTo(preview);
        iframe = iframe[0];

	var idoc = iframe.contentWindow ? iframe.contentWindow.document /* For IE5.5 and IE 6*/: 
          iframe.contentDocument ? iframe.contentDocument /* For NS6 */: iframe.document /* the rest */; 

        idoc.open();
        idoc.writeln('<div id="formatted"></div>');
        idoc.close();
        markdown.preview = $('#formatted', idoc);
        markdown.preview.html(markdown.converter.makeHtml($(textarea).val()));
      }

      var show_preview = preview ? {
        change: function(value) {
          markdown.preview.html(markdown.converter.makeHtml(value));
	}
      } : {}
      var textarea = $(textarea).TextArea(show_preview);

      var toolbar = $.Toolbar(textarea, {
  	className: "markdown_toolbar"
      });

      markdown.add_buttons(toolbar);      
    },

    add_buttons: function (toolbar) {
      toolbar.addButton('Italics',function(){ 
        this.wrapSelection('*','*');  
      },{  
        id: 'markdown_italics_button',
	title: 'italics'
      });

      toolbar.addButton('Bold',function(){  
        this.wrapSelection('**','**');  
      },{  
        id: 'markdown_bold_button',
	title: 'bold'
      });  

      toolbar.addButton('Link',function(){  
        var selection = this.getSelection();  
        var response = prompt('Enter Link URL','');  

	if(response == null) {
	  return;
	}
	this.replaceSelection('[' + (selection == '' ? 'Link Text' : selection) + '](' + (response == '' ? 'http://link_url/' : response).replace(/^(?!(f|ht)tps?:\/\/)/,'http://') + ')');  
      },{  
        id: 'markdown_link_button',
	title: 'insert http link'
      });

      toolbar.addButton('Image',function(){  
        var selection = this.getSelection();  
        var response = prompt('Enter Image URL','');  
        if(response == null)  
            return;  
        this.replaceSelection('![' + (selection == '' ? 'Image Alt Text' : selection) + '](' + (response == '' ? 'http://image_url/' : response).replace(/^(?!(f|ht)tps?:\/\/)/,'http://') + ')');  
      },{  
        id: 'markdown_image_button',
	title: 'insert image'
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
        id: 'markdown_heading_button',
	title: 'heading'
      });  

      toolbar.addButton('Unordered List',function(event){  
        this.collectFromEachSelectedLine(function(line){  
          return event.shiftKey ? (line.match(/^\*{2,}/) ? line.replace(/^\*/,'') : line.replace(/^\*\s/,'')) : (line.match(/\*+\s/) ? '*' : '* ') + line;  
        });  
      },{  
        id: 'markdown_unordered_list_button',
	title: 'bullet list'
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
        id: 'markdown_ordered_list_button',
	title: 'number list'
      });  

      toolbar.addButton('Block Quote',function(event){  
        this.collectFromEachSelectedLine(function(line){  
            return event.shiftKey ? line.replace(/^\> /,'') : '> ' + line;  
        });  
      },{  
        id: 'markdown_quote_button',
	title: 'block quote'
      });  

      toolbar.addButton('Code Block',function(event){  
        this.collectFromEachSelectedLine(function(line){  
            return event.shiftKey ? line.replace(/    /,'') : '    ' + line;  
        });  
      },{  
        id: 'markdown_code_button',
	title: 'code block'
      });  

      toolbar.addButton('Help',function(){  
        window.open('http://daringfireball.net/projects/markdown/dingus');  
      },{  
        id: 'markdown_help_button',
	title: 'help'
      });
    } 
  }

  $.fn.markdown = function (preview) {
    var textarea = $(this).get(0);
    markdown.init(textarea, preview);
  }
})();
