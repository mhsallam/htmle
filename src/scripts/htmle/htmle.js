; (function ($, undefined) {
    // Create the defaults once
    var pluginName = 'htmle';
    var defaults = {
        id: null,
        basePath: null,
        encodeBeforeSubmit: true
    };

    // The actual plugin constructor
    function Htmle(element, options) {
        this.element = element;
        this.$E = $(element);

        var basePath = null;
        var src = $('script[src$="htmle.js"]').first().attr('src');
        if (options && options['basePath'])
            basePath = options['basePath'];
        else if (src && src.match(/[/]/))
            basePath = src.substring(0, src.lastIndexOf('/'));
        else {
            var loc = location.toString();
            basePath = loc.substring(0, loc.lastIndexOf('/'));
        }

        console.log(basePath);
        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        defaults.basePath = basePath;
        this.options = $.extend({}, defaults, options);

        this._name = pluginName;

        this._init();
        return this;
    }

    Htmle.prototype._init = function () {
        this.$E.css('display', 'none');

        var htmlearea = $('<div class="htmle">');
        this.$E.after(htmlearea);

        this._createTools();

        var htmleBody = $('<div>');
        htmleBody
			.addClass('body')
            .html(this.$E.text());

        var text = this.$E.text();
        if (!text)
            text = '<p><br></p>';

        var htmlebody = $('<div>');
        htmlebody
            .attr('contentEditable', true)
			.addClass('body')
            .html(text);

        var htmleview = $('<div class="editview">');
        if (defaults['height'])
            htmleview.css('height', defaults['height']);
        var htmlewrapper = $('<div class="wrapper">');

        htmleview.append(htmlewrapper);
        htmlewrapper.append(htmlebody);
        htmlearea.append(htmleview);

        var scope = this;
        this.$E.change(function () {
            scope.$E.parent().find('div.htmle .body');
            bdy.html($(this).html());
        });
        this.$E.closest('form').submit(function () {
            var bdy = scope.$E.parent().find('div.htmle .body');
            if (bdy.css('display') === 'none')
                scope._switchMode();

            if (defaults['encodeBeforeSubmit'])
                scope.$E.text(bdy.html());
            else
                scope.$E.html(bdy.html());
        });
    }
    Htmle.prototype._createTools = function () {
        var scope = this;
        var htmlearea = this.$E.parent().find('div.htmle');
        htmleTools = $('<div>');
        htmleTools
			.prependTo(htmlearea)
			.addClass('tools')


        var htmleStandardTools = $('<div style="float: left;">');
        var htmleSelectionTools = $('<div style="float: left;">');
        var htmleFontTools = $('<div style="float: left;">');
        var htmleParagraphTools = $('<div style="float: left;">');
        var htmleInsertTools = $('<div style="float: left;">');

        
        if (this._includeControl('btn-html'))
            htmleTools.append(this._createButton({
                id: 'btn-html', content: 'Html Mode', command: function () {
                    scope._switchMode();
                }
            }));

        if (this._includeControl('btn-clear'))
            htmleStandardTools.append(this._createButton({
                id: 'btn-clear', content: 'Clean', command: function () {
                    var bdy = scope.$E.parent().find('div.htmle .body');
                    bdy.html('<p><br></p>');
                }
            }));
        if (this._includeControl('btn-print'))
            htmleStandardTools.append(this._createButton({ id: 'btn-print', content: 'Print', command: ['print'] }));
        if (this._includeControl('btn-undo'))
            htmleStandardTools.append(this._createButton({ id: 'btn-undo', content: 'Undo', command: ['undo'] }));
        if (this._includeControl('btn-redo'))
            htmleStandardTools.append(this._createButton({ id: 'btn-redo', content: 'Redo', command: ['redo'] }));
        if (this._includeControl('btn-removeformat'))
            htmleStandardTools.append(this._createButton({ id: 'btn-removeformat', content: 'Remove formatting', command: ['removeformat'] }));
        if (this._includeControl('btn-selectall'))
            htmleStandardTools.append(this._createButton({ id: 'btn-selectall', content: 'Select all', command: ['selectall'] }));
        htmleStandardTools.append(this._createSeparate());

        if (this._includeControl('btn-bold'))
            htmleSelectionTools.append(this._createButton({ id: 'btn-bold', content: 'Bold', command: ['bold'] }));
        if (this._includeControl('btn-italic'))
            htmleSelectionTools.append(this._createButton({ id: 'btn-italic', content: 'Italic', command: ['italic'] }));
        if (this._includeControl('btn-underline'))
            htmleSelectionTools.append(this._createButton({ id: 'btn-underline', content: 'Underline', command: ['underline'] }));

        if (this._includeControl('dropdown-fontsize'))
            htmleFontTools.append(this._createDropdown({
                id: 'dropdown-fontsize', command: 'fontsize', content: '<i class="fa fa-text-height">', options: [
                    { text: '1', value: '1' },
                    { text: '2', value: '2' },
                    { text: '3', value: '3' },
                    { text: '4', value: '4' },
                    { text: '5', value: '5' },
                    { text: '6', value: '6' },
                    { text: '7', value: '7' }
                ]
            }));
        if (this._includeControl('dropdown-fontname'))
            htmleFontTools.append(this._createDropdown({
                id: 'dropdown-fontname', command: 'fontname', content: '<i class="fa fa-font">', options: [
                    { text: 'Arial', value: 'arial' },
                    { text: 'Sans-serif', value: 'sans-serif' },
                    { text: 'Segoe UI', value: 'segoe ui' },
                    { text: 'Tahoma', value: 'tahoma' },
                    { text: 'Trebuchet MS', value: 'trebuchet ms' },
                    { text: 'Courier New', value: 'courier new' },
                    { text: 'Times New Roman', value: 'times new roman' }
                ]
            }));

        if (this._includeControl('dropdown-forecolor'))
            htmleFontTools.append(this._createForecolorPicker({
                id: 'dropdown-forecolor', command: 'forecolor', content: '<i class="fa fa-pencil">', options: this._colorItems
            }));

        if (this._includeControl('dropdown-backcolor'))
            htmleFontTools.append(this._createColorPicker({
                id: 'dropdown-backcolor', command: 'backcolor', content: '<i class="fa fa-tint">', options: this._colorItems
            }));

        if (this._includeControl('btn-alignleft'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-alignleft', content: 'Left align', command: ['justifyleft'] }));
        if (this._includeControl('btn-aligncenter'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-aligncenter', content: 'Center align', command: ['justifycenter'] }));
        if (this._includeControl('btn-alignright'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-alignright', content: 'Right align', command: ['justifyright'] }));
        if (this._includeControl('btn-alignjust'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-alignjust', content: 'Justify align', command: ['justify'] }));

        htmleParagraphTools.append(this._createSeparate());
        if (this._includeControl('btn-indentdec'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-indentdec', content: 'Add indentation', command: ['outdent'] }));
        if (this._includeControl('btn-indentinc'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-indentinc', content: 'Delete indentation', command: ['indent'] }));

        htmleParagraphTools.append(this._createSeparate());
        if (this._includeControl('btn-orderlist'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-orderedlist', content: 'Ordered list', command: ['insertorderedlist'] }));
        if (this._includeControl('btn-unorderedlist'))
            htmleParagraphTools.append(this._createButton({ id: 'btn-unorderedlist', content: 'Unordered list', command: ['insertunorderedlist'] }));

        htmleParagraphTools.append(this._createSeparate());
        if (this._includeControl('dropdown-formatblock'))
            htmleParagraphTools.append(this._createDropdown({
                id: 'dropdown-formatblock', command: 'formatblock', content: '<i class="fa fa-paragraph">', options: [
                    { text: 'H1', value: '<h1>' },
                    { text: 'H2', value: '<h2>' },
                    { text: 'H3', value: '<h3>' },
                    { text: 'H4', value: '<h4>' },
                    { text: 'H5', value: '<h5>' },
                    { text: 'H6', value: '<h6>' },
                    { text: 'Paragraph', value: '<p>' },
                    { text: 'Block Quote', value: '<blockquote>' },
                    { text: 'Address', value: '<address>' },
                    { text: 'PRE', value: '<pre>' }
                ]
            }));
        htmleParagraphTools.append(this._createSeparate());

        if (this._includeControl('btn-createlink'))
            htmleInsertTools.append(this._createButton({
                id: 'btn-createlink', content: 'Create Link', command: function () {
                    var savedSel = scope._saveSelection();
                    var url = document.queryCommandValue('createlink')
                    scope._showDialog(
                        'hyperlink',
                        { 'modal-title': 'Link', 'link-url': url },
                        function (modal) {
                            url = $(modal).find('#link-url').val();
                            scope._restoreSelection(savedSel);
                            document.execCommand("createlink", false, url);
                        });
                }
            }));
        if (this._includeControl('btn-unlink'))
            htmleInsertTools.append(this._createButton({ id: 'btn-unlink', content: 'Remove Link', command: ['unlink'] }));
        htmleInsertTools.append(this._createSeparate());

        htmleTools
            .append(htmleStandardTools)
            .append(htmleInsertTools)
            .append(htmleSelectionTools)
            .append(htmleParagraphTools)
            .append(htmleFontTools);
    }
    Htmle.prototype._includeControl = function (name)
    {
        if (this.options.controlsIncluded)
            return $.inArray(name, this.options.controlsIncluded);

        return (!this.options.controlsExcluded || $.inArray(name, this.options.controlsExcluded) == -1);
    }
    Htmle.prototype._createButton = function (data) {
        var scope = this;
        var btn = $('<button>');
        btn
            .attr('type', 'button')
			.attr('id', data['id'])
			.attr('title', data['content'])
			.addClass('btn btn-htmle')
			.click(function () {
			    if (data['command'] instanceof Array) {
			        scope._applyCommand(data['command'], $(this));
			    }
			    else if (typeof (data['command']) == 'function') {
			        data['command']($(this));
			    }
			});

        return btn;
    }
    Htmle.prototype._createDropdown = function (data) {
        var container = $('<div class="dropdown-htmle">')
        var dropdown = $('<select id="' + data.id + '">');
        if (data.options) {
            for (var i in data.options) {
                var opt = $('<option>');
                opt
                    .attr('value', data.options[i].value)
                    .text(data.options[i].text)
                    .appendTo(dropdown);
            }

            var scope = this;
            dropdown.on('change', function () {
                var option = $(this).find('option:selected');
                if (typeof (data.command) == 'string') {
                    scope._applyCommand([data.command, false, option.val()], $(this));
                }
                else if (typeof (data.command) == 'function') {
                    data.command($(this));
                }
            })

        }
        container
            .append('<span>' + data.content + '</span>')
            .append(dropdown);
        return container;
    }
    Htmle.prototype._createColorPicker = function (data) {
        var container = $('<div class="dropdown-htmle">')
        var dropdown = $('<select id="' + data.id + '">');
        if (data && data.options) {
            for (var i in data.options) {
                var opt = null;
                if (!this._isLightColor(data.options[i].value))
                    opt = $('<option style="background-color: ' + data.options[i].value + '; color: #000;">');
                else
                    opt = $('<option style="background-color: ' + data.options[i].value + '; color: #fff;">');
                opt
                    .attr('value', data.options[i].value)
                    .text(data.options[i].text)
                    .appendTo(dropdown);
            }

            var scope = this;
            dropdown.on('change', function () {
                var option = $(this).find('option:selected');
                if (typeof (data.command) == 'string') {
                    scope._applyCommand([data.command, false, option.val()], $(this));
                }
                else if (typeof (data.command) == 'function') {
                    data.command($(this));
                }
            })

        }
        container
            .append('<span>' + data.content + '</span>')
            .append(dropdown);
        return container;
    }
    Htmle.prototype._createForecolorPicker = function (data) {
        var container = $('<div class="dropdown-htmle">')
        var dropdown = $('<select id="' + data.id + '">');
        if (data && data.options) {
            for (var i in data.options) {
                var opt = null;
                if (!this._isLightColor(data.options[i].value, 450) || data.options[i].text == 'White')
                    opt = $('<option style="color: ' + data.options[i].value + '; background: #000;">');
                else
                    opt = $('<option style="color: ' + data.options[i].value + '; background: #fff;">');
                opt
                    .attr('value', data.options[i].value)
                    .text(data.options[i].text)
                    .appendTo(dropdown);
            }

            var scope = this;
            dropdown.on('change', function () {
                var option = $(this).find('option:selected');
                if (typeof (data.command) == 'string') {
                    scope._applyCommand([data.command, false, option.val()], $(this));
                }
                else if (typeof (data.command) == 'function') {
                    data.command($(this));
                }
            })

        }
        container
            .append('<span>' + data.content + '</span>')
            .append(dropdown);
        return container;
    }
    Htmle.prototype._isLightColor = function (color, setup) {
        var c = color.substring(1);      // strip #
        var rgb = parseInt(c, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >> 8) & 0xff;  // extract green
        var b = (rgb >> 0) & 0xff;  // extract blue

        //var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

        //return (luma < 60);
        if (!setup)
            setup = 250;

        return (r + g + b) < setup;
    }
    Htmle.prototype._createSeparate = function () {
        return $('<div class="btns-separate">');
    }
    Htmle.prototype._applyCommand = function (arguments, source) {
        var bdy = this.$E.parent().find('div.htmle .body');
        if (bdy.css('display') !== 'none') {
            bdy.focus();
            document.execCommand(arguments[0], arguments[1], arguments[2]);
        }
    }
    Htmle.prototype._switchMode = function () {
        var bdy = this.$E.parent().find('div.htmle .body');
        if (bdy.css('display') !== 'none') {
            bdy
                .attr('contentEditable', false)
	            .hide();

            var htmleCode = $('<div>');
            htmleCode
                .attr('spellcheck', 'false')
                .addClass('codebody')
                .text(bdy.html())
                .attr('contentEditable', true);

            bdy.after(htmleCode);
            this.$E.parent().find('.editview').addClass('codeview');

            htmleCode.focus();
        }
        else {
            var cod = this.$E.parent().find('div.htmle .codebody');
            if (cod.length > 0) {
                bdy.html(cod.text());
                cod.remove();
            }
            bdy
                .attr('contentEditable', true)
                .show()
	            .focus();

            var area = this.$E.parent().find('div.htmle .editview');
            area.removeClass('codeview');
        }
    }

    Htmle.prototype._showDialog = function (template, args, handler) {
        var dialog = this._fillDialog(this._dialogTemplates[template], args);
        dialog.appendTo('body');
        dialog.find('.btn-ok').on('click', function () {
            if (typeof handler == 'function') {
                handler(dialog);
            }
        });
        dialog.on('hidden.bs.modal', function (e) {
            $(this).modal('hide');
            $(this).remove();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });
        dialog.modal('show');
        setTimeout(function () {
            dialog.find('[autofocus]:first').focus();
        }, 300);
    }
    Htmle.prototype._fillDialog = function (template, args) {
        for (var arg in args) {
            template = template.replace('${' + arg + '}', args[arg]);
        }
        return $(template);
    }

    Htmle.prototype._saveSelection = function () {
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var ranges = [];
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    ranges.push(sel.getRangeAt(i));
                }
                return ranges;
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }
    Htmle.prototype._restoreSelection = function (savedSel) {
        if (savedSel) {
            if (window.getSelection) {
                sel = window.getSelection();
                sel.removeAllRanges();
                for (var i = 0, len = savedSel.length; i < len; ++i) {
                    sel.addRange(savedSel[i]);
                }
            } else if (document.selection && savedSel.select) {
                savedSel.select();
            }
        }
    }

    Htmle.prototype.getContent = function () {
        var bdy = this.$E.parent().find('div.htmle .body');
        return bdy.html();
    }

    $.fn[pluginName] = function (methodOrOptions) {
        if (!$(this).length) {
            return $(this);
        }

        var instance = $(this).data(pluginName);
        // CASE: action method (public method on the plugin class) 
        if (instance
            && instance[methodOrOptions]
            && typeof instance[methodOrOptions] == 'function'
            && methodOrOptions.indexOf('_') != 0) {

            return instance[methodOrOptions](Array.prototype.slice.call(arguments, 1));

            // CASE: argument is options object or empty = initialise            
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {

            instance = new Htmle($(this), methodOrOptions);    // ok to overwrite if this is a re-init
            $(this).data(pluginName, instance);
            return $(this);

            // CASE: method called before init
        } else if (!instance) {

            $.error('Plugin must be initialised before using method: ' + methodOrOptions);

            // CASE: invalid method
        } else if (methodOrOptions.indexOf('_') == 0) {

            $.error('Method ' + methodOrOptions + ' is private!');

        } else {

            $.error('Method ' + methodOrOptions + ' does not exist.');

        }
    }


    Htmle.prototype._dialogTemplates = {
        hyperlink: 
            '<div id="htmle-modal-col-editor" class="modal fade" role="dialog" style="display: none;">' +
            '  <div class="modal-dialog">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '        <h4 class="modal-title">${modal-title}</h4>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '        <div class="row">' +
            '          <div class="form-group col-md-6">' +
            '            <label for="link-url" data-lingokey="htmle.url">Url</label>' +
            '            <input id="link-url" name="link-url" class="form-control input-sm" value="${link-url}" autofocus />' +
            '          </div>' +
            '        </div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-ok btn-primary" data-dismiss="modal" data-lingokey="common.ok">OK</button>' +
            '        <button type="button" class="btn btn-cancel btn-default" data-dismiss="modal" data-lingokey="common.cancel">Cancel</button>' +
            '      </div>' +
            '    </div><!-- /.modal-content -->' +
            '  </div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->'
    };

    Htmle.prototype._colorItems = [
                { text: 'Aliceblue', value: '#f0f8ff' },
                { text: 'Antiquewhite', value: '#faebd7' },
                { text: 'Aqua', value: '#0ff' },
                { text: 'Aquamarine', value: '#7fffd4' },
                { text: 'Azure', value: '#f0ffff' },
                { text: 'Beige', value: '#f5f5dc' },
                { text: 'Bisque', value: '#ffe4c4' },
                { text: 'Black', value: '#000000' },
                { text: 'Blanchedalmond', value: '#ffebcd' },
                { text: 'Blue', value: '#00f' },
                { text: 'Blueviolet', value: '#8a2be2' },
                { text: 'Brown', value: '#a52a2a' },
                { text: 'Burlywood', value: '#deb887' },
                { text: 'Cadetblue', value: '#5f9ea0' },
                { text: 'Chartreuse', value: '#7fff00' },
                { text: 'Chocolate', value: '#d2691e' },
                { text: 'Coral', value: '#ff7f50' },
                { text: 'Cornflowerblue', value: '#6495ed' },
                { text: 'Cornsilk', value: '#fff8dc' },
                { text: 'Crimson', value: '#dc143c' },
                { text: 'Cyan', value: '#0ff' },
                { text: 'Darkblue', value: '#00008b' },
                { text: 'Darkcyan', value: '#008b8b' },
                { text: 'Darkgoldenrod', value: '#b8860b' },
                { text: 'Darkgray', value: '#a9a9a9' },
                { text: 'Darkgreen', value: '#006400' },
                { text: 'Darkkhaki', value: '#bdb76b' },
                { text: 'Darkmagenta', value: '#8b008b' },
                { text: 'Darkolivegreen', value: '#556b2f' },
                { text: 'Darkorange', value: '#ff8c00' },
                { text: 'Darkorchid', value: '#9932cc' },
                { text: 'Darkred', value: '#8b0000' },
                { text: 'Darksalmon', value: '#e9967a' },
                { text: 'Darkseagreen', value: '#8fbc8f' },
                { text: 'Darkslateblue', value: '#483d8b' },
                { text: 'Darkslategray', value: '#2f4f4f' },
                { text: 'Darkturquoise', value: '#00ced1' },
                { text: 'Darkviolet', value: '#9400d3' },
                { text: 'deeppink', value: '#ff1493' },
                { text: 'Deepskyblue', value: '#00bfff' },
                { text: 'Dimgray', value: '#696969' },
                { text: 'Dodgerblue', value: '#1e90ff' },
                { text: 'Firebrick', value: '#b22222' },
                { text: 'Floralwhite', value: '#fffaf0' },
                { text: 'Forestgreen', value: '#228b22' },
                { text: 'Fuchsia', value: '#f0f' },
                { text: 'Gainsboro', value: '#dcdcdc' },
                { text: 'Ghostwhite', value: '#f8f8ff' },
                { text: 'Gold', value: '#ffd700' },
                { text: 'Goldenrod', value: '#daa520' },
                { text: 'Gray', value: '#808080' },
                { text: 'Green', value: '#008000' },
                { text: 'Greenyellow', value: '#adff2f' },
                { text: 'Honeydew', value: '#f0fff0' },
                { text: 'Hotpink', value: '#ff69b4' },
                { text: 'Indianred', value: '#cd5c5c' },
                { text: 'Indigo', value: '#4b0082' },
                { text: 'Ivory', value: '#fffff0' },
                { text: 'Khaki', value: '#f0e68c' },
                { text: 'Lavender', value: '#e6e6fa' },
                { text: 'Lavenderblush', value: '#fff0f5' },
                { text: 'Lawngreen', value: '#7cfc00' },
                { text: 'Lemonchiffon', value: '#fffacd' },
                { text: 'Lightblue', value: '#add8e6' },
                { text: 'Lightcoral', value: '#f08080' },
                { text: 'Lightcyan', value: '#e0ffff' },
                { text: 'Lightgoldenrodyellow', value: '#fafad2' },
                { text: 'Lightgreen', value: '#90ee90' },
                { text: 'Lightgrey', value: '#d3d3d3' },
                { text: 'Lightpink', value: '#ffb6c1' },
                { text: 'Lightsalmon', value: '#ffa07a' },
                { text: 'Lightseagreen', value: '#20b2aa' },
                { text: 'Lightskyblue', value: '#87cefa' },
                { text: 'Lightslategray', value: '#789' },
                { text: 'Lightsteelblue', value: '#b0c4de' },
                { text: 'Lightyellow', value: '#ffffe0' },
                { text: 'Lime', value: '#0f0' },
                { text: 'Limegreen', value: '#32cd32' },
                { text: 'Linen', value: '#faf0e6' },
                { text: 'Magenta', value: '#f0f' },
                { text: 'Maroon', value: '#800000' },
                { text: 'Mediumauqamarine', value: '#66cdaa' },
                { text: 'Mediumblue', value: '#0000cd' },
                { text: 'Mediumorchid', value: '#ba55d3' },
                { text: 'Mediumpurple', value: '#9370d8' },
                { text: 'Mediumseagreen', value: '#3cb371' },
                { text: 'Mediumslateblue', value: '#7b68ee' },
                { text: 'Mediumspringgreen', value: '#00fa9a' },
                { text: 'Mediumturquoise', value: '#48d1cc' },
                { text: 'Mediumvioletred', value: '#c71585' },
                { text: 'Midnightblue', value: '#191970' },
                { text: 'Mintcream', value: '#f5fffa' },
                { text: 'Mistyrose', value: '#ffe4e1' },
                { text: 'Moccasin', value: '#ffe4b5' },
                { text: 'Navajowhite', value: '#ffdead' },
                { text: 'Navy', value: '#000080' },
                { text: 'Oldlace', value: '#fdf5e6' },
                { text: 'Olive', value: '#808000' },
                { text: 'Olivedrab', value: '#688e23' },
                { text: 'Orange', value: '#ffa500' },
                { text: 'Orangered', value: '#ff4500' },
                { text: 'Orchid', value: '#da70d6' },
                { text: 'Palegoldenrod', value: '#eee8aa' },
                { text: 'Palegreen', value: '#98fb98' },
                { text: 'Paleturquoise', value: '#afeeee' },
                { text: 'Palevioletred', value: '#d87093' },
                { text: 'Papayawhip', value: '#ffefd5' },
                { text: 'Peachpuff', value: '#ffdab9' },
                { text: 'Peru', value: '#cd853f' },
                { text: 'Pink', value: '#ffc0cb' },
                { text: 'Plum', value: '#dda0dd' },
                { text: 'Powderblue', value: '#b0e0e6' },
                { text: 'Purple', value: '#800080' },
                { text: 'Red', value: '#f00' },
                { text: 'Rosybrown', value: '#bc8f8f' },
                { text: 'Royalblue', value: '#4169e1' },
                { text: 'Saddlebrown', value: '#8b4513' },
                { text: 'Salmon', value: '#fa8072' },
                { text: 'Sandybrown', value: '#f4a460' },
                { text: 'Seagreen', value: '#2e8b57' },
                { text: 'Seashell', value: '#fff5ee' },
                { text: 'Sienna', value: '#a0522d' },
                { text: 'Silver', value: '#c0c0c0' },
                { text: 'Skyblue', value: '#87ceeb' },
                { text: 'Slateblue', value: '#6a5acd' },
                { text: 'Slategray', value: '#708090' },
                { text: 'Snow', value: '#fffafa' },
                { text: 'Springgreen', value: '#00ff7f' },
                { text: 'Steelblue', value: '#4682b4' },
                { text: 'Tan', value: '#d2b48c' },
                { text: 'Teal', value: '#008080' },
                { text: 'Thistle', value: '#d8bfd8' },
                { text: 'Tomato', value: '#ff6347' },
                { text: 'Turquoise', value: '#40e0d0' },
                { text: 'Violet', value: '#ee82ee' },
                { text: 'Wheat', value: '#F5DEB3' },
                { text: 'White', value: '#fff' },
                { text: 'Whitesmoke', value: '#f5f5f5' },
                { text: 'Yellow', value: '#ff0' },
                { text: 'YellowGreen', value: '#9acd32' }
    ];
})(jQuery);