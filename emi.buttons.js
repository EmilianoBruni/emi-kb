(function() {

    function vmFrmButton() {
        this.visible = ko.observable(false);
        this.enabled = ko.observable(true);
    }

    function vmFrmButtons(params) {
        _.extend(this, Backbone.Events);
        this.isNew = ko.observable(false);
        this.buttons = {
            save: new vmFrmButton(),
            delete: new vmFrmButton(),
            new: new vmFrmButton(),
            clone: new vmFrmButton(),
        }
        this.btn_clicked = function(vm, event) {

            var class_event = $(event.currentTarget).attr('class').match(/btn-(success|danger|primary|warning)/)[0];
            var trigged_event;

            switch (class_event) {
                case 'btn-success':
                    trigged_event = 'save';
                    break;
                case 'btn-danger':
                    trigged_event = 'delete';
                    break;
                case 'btn-primary':
                    trigged_event = 'new';
                    break;
                case 'btn-warning':
                    trigged_event = 'clone';
                    break;
            }
            if (params.view_model) {
                this.trigger(trigged_event);
            } else {
                $(window).trigger(trigged_event);
            }
        };
        /* se il parent ha rischiesto il mio view_model
         * <emi-buttons params="view_model: vmButtons"></emi-buttons>
         * glielo ritorno. Il parametro view_model deve essere un osservabile */
        if (params && params.view_model) params.view_model(this);
        var visible = (params && params.visible) || ['save', 'delete', 'new', 'clone'];
        visible.forEach(function(item) {
            this.buttons[item].visible(true);
        }.bind(this));
    };

    var buttonsTemplate = function() {
        var buttons = {
            save: { template: '<button class="btn btn-success btn-block" data-bind="click: btn_clicked, visible: buttons.save.visible(), enable: buttons.save.enabled(), "> <i class="far fa-save fa-lg fa-fw"></i> Salva</button>' },
            delete: { template: '<button class="btn btn-danger btn-block" data-bind="click: btn_clicked, visible: buttons.delete.visible(), enable: buttons.delete.enabled()"> <i class="far fa-trash-alt fa-lg fa-fw"></i> Elimina</button>' },
            new: { template: '<button class="btn btn-primary btn-block" data-bind="click: btn_clicked, visible: buttons.new.visible(), enable: buttons.new.enabled()"> <i class="far fa-file fa-lg fa-fw"></i> Nuovo</button>' },
            clone: { template: '<button class="btn btn-warning btn-block" data-bind="click: btn_clicked, visible: buttons.clone.visible(), enable: buttons.clone.enabled()"><i class="fa fa-clone fa-lg fa-fw"></i> Duplica</button>' },
        }
        //var enabled = (params && params.enabled) || ['save', 'delete', 'new', 'clone'];
        var enabled = ['save', 'delete', 'new', 'clone'];
        var template = '';
        enabled.forEach(function(item) {
            template = template + ' ' + buttons[item].template;
        });
        return template;
    };


    ko.components.register('emi-buttons', {
        viewModel: vmFrmButtons,
        template: buttonsTemplate()
    });
})();


function cssEngine(rule) {
    var css = document.createElement('style'); // Creates <style></style>
    css.type = 'text/css'; // Specifies the type
    if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
    else css.appendChild(document.createTextNode(rule)); // Support for the rest
    document.getElementsByTagName("head")[0].appendChild(css); // Specifies where to place the css
}

// CSS rules
var rule = '@media all and (min-width:480px) {' +
    '.btn-block { ' +
    '    display:inline; ' +
    '    width:auto; ' +
    '    margin-top:0px !important; ' +
    '}' +
    '}   ';

// Load the rules and execute after the DOM loads
$(function() { cssEngine(rule) });
