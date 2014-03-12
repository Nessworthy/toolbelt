/**
 * Accordion plugin for jQuery - turns a well-structured element into an accordion.
 *
 * Required structure:
 *
 * element[data-js-accordion]
 *     element[data-js-accordion-trigger]
 *     element[data-js-accordion-content]
 *
 * Adds checkable classes to the following js-accordion elements:
 *     [data-js-accordion]:
 *         is-accordion - Added when accordion is created
 *         is-accordion--collapsed - Added when an accordion is collapsed, removed when expanded.
 *     [data-js-accordion-trigger]
 *         is-accordion-trigger - Added when accordion is created.
 *     [data-js-accordion-content]
 *         is-accordion-content - Added when accordion content is created.
 *
 * It is advised your accordion trigger is a § anchor. E.g.
 * <a href="#content" name="content" data-js-accordion-trigger>Trigger</a>
 * 
 * @author Sean Nessworthy <sean@nessworthy.me>
 * @version 1.0
 */

if(typeof window.jQuery !== 'function') {
    throw 'jQuery is not defined, silly!';
}

if(typeof window.jQuery.fn.accordion === 'function') {
    throw 'The jQuery plugin namespace \'accordion\' is already taken!';
}

window.jQuery.fn.accordion = function() {

    var self = this;

    (function($) {

        var config = {
                'data_container'         : 'js-accordion',
                'data_trigger'           : 'js-accordion-trigger',
                'data_content'           : 'js-accordion-content',
                'data_content_state'     : 'js-accordion-content-state',
                'states' : {
                    'visible'   : 'visible',
                    'collapsed' : 'collapsed',
                    'default'   : 'collapsed' // The key state, not the value
                }
            },
            elements = $(self);

        /**
         * Wraps a data-selector around a string.
         * E.g. 'foo' becomes '[data-foo]'
         * @param  {String} dataName The string to convert to a data selector.
         * @return {String}          The data selector string.
         */
        function toDataSelector(dataName) {
            return '[data-' + dataName + ']';
        }

        /**
         * Retrieves the trigger element from a container's perspective.
         * @param  {mixed} element jQuery collection or a node.
         * @return {Object}        jQuery node of the trigger element.
         */
        function getTrigger(element) {
            return $(element).find(toDataSelector(config.data_trigger));
        }

        /**
         * Retrieves the content element from a container's perspective
         * @param  {mixed} element jQuery collection or a node.
         * @return {Object}        jQuery node of the content element.
         */
        function getContent(element) {
            return $(element).find(toDataSelector(config.data_content));
        }

        /**
         * Retrieves the current state VALUE of a given state element (a container)
         * @param  {mixed} element jQuery collection or a node.
         * @return {mixed}         The value of the state stored in the given node.
         */
        function getState(element) {

            var state =  $(element).data(config.data_content_state);

            return !!state ? state : getDefaultState();

        }

        /**
         * Returns the default state VALUE for accordions.
         * @return {mixed} The value of config.states.[x], where [x] = the value of config.states.default
         */
        function getDefaultState() {

            var state = config.states[config.states.default];

            // Ultimately, if we can't get a default state, throw a wobbler.
            if(!state) {
                throw 'No default state found for accordion.';
            }

            return state;

        }

        function getElement(elem) {
            return $(elem).closest(toDataSelector(config.data_container));
        }

        function isCollapsed(state) {
            return state === config.states.collapsed;
        }

        function isVisible(state) {
            return state === config.states.visible;
        }

        function setVisible(element, initial) {
            element.data(config.data_content_state, config.states.visible);
            element.removeClass('is-accordion--collapsed');

            if(initial) {

                getContent(element).show(0);

            } else {

                getContent(element).stop().slideDown('fast');

            }
        }

        function setCollapsed(element, initial) {
            element.data(config.data_content_state, config.states.collapsed);
            element.addClass('is-accordion--collapsed');

            if(initial) {

                getContent(element).hide(0);

            } else {

                getContent(element).stop().slideUp('fast');

            }
        }

        function setDefault(elements) {

            var state = config.states.default;

            if(isCollapsed(state)) {

                setCollapsed(elements, true);

            } else if(isVisible(state)) {

                setVisible(elements, true);

            }


        }

        setDefault(elements);

        // Add the supported base classes and bind the event to trigger the accordions.
        elements.addClass('is-accordion');
        getContent(elements).addClass('is-accordion-content');
        getTrigger(elements).addClass('is-accordion-trigger').on('click', function(ev) {

            ev.preventDefault();

            var parent = getElement(this),
                state = getState(parent);

            if(isCollapsed(state)) {

                setVisible(parent);

            } else if(isVisible(state)) {

                setCollapsed(parent);

            }

            return false;

        });

    }(window.jQuery));

    return this;

};

window.jQuery(function() {

    window.jQuery('[data-js-accordion]').accordion();

});