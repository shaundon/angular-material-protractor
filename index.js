// Various utility functions to make testing easier.


// Checks if an <input> has the right value.
exports.checkValueOfTextFieldByModel = function(model, expected) {
    var foundElement = element(by.model(model));
    expect(foundElement.getAttribute('value')).toBe(expected);
};

// Checks if an <md-checkbox> has the right value.
exports.checkValueOfMdCheckboxByModel = function(model, expected) {
    var foundElement = element(by.model(model));
    expect(foundElement.getAttribute('aria-checked')).toBe(expected);
};

// Checks if an <md-select> has the right value.
exports.checkValueOfMdSelectByModel = function(model, expected) {
    var foundElement = element(by.css('md-select[ng-model="' + model + '"] md-select-value span .md-text'));
    expect(foundElement.getText()).toBe(expected);
};

// Checks if an <md-chips> has the right values.
exports.checkValueOfMdChipsByModel = function(model, expected) {
    var resultingArray = [];
    element.all(by.css('md-chips[ng-model="' + model + '"] md-chip .md-chip-content span')).then(function(chips) {
        var totalChips = chips.length;
        var count = 0;
        for (var i in chips) {
            chips[i].getText().then(function(text) {
                resultingArray.push(text);
                count++;
                if (count === totalChips) {
                    expect(resultingArray).toEqual(expected);
                }
            });
        }
    });
};

exports.updateTextFieldByModel = function(model, text) {
    var foundElement = element(by.model(model));

    // Ensure that the field isn't disabled, readonly or hidden.
    foundElement.getAttribute('readonly').then(function(readonly) {
        foundElement.getAttribute('disabled').then(function(disabled) {
            foundElement.isDisplayed().then(function(isVisible) {
                if (!readonly && !disabled && isVisible) {
                    foundElement.clear().then(function() {
                        foundElement.sendKeys(text);
                    });
                }
            });
        });
    });

    if (foundElement && !foundElement.getAttribute('readonly')) {
        foundElement.clear().then(function () {
            foundElement.sendKeys(text);
        });
    }
};

exports.checkFieldExistsByBinding = function(binding) {
    var foundElement = element(by.binding(binding));
    expect(foundElement.isPresent()).toBeTruthy();
};

exports.checkFieldDoesNotExistByBinding = function(binding) {
    var foundElement = element(by.binding(binding));
    expect(foundElement.isPresent()).toBeFalsy();
};

exports.checkFieldExistsByModel = function(model) {
    var foundElement = element(by.model(model));
    expect(foundElement.isPresent()).toBeTruthy();
};

exports.clickElementByModel = function(model) {
    var foundElement = element(by.model(model));
    foundElement.click();
};

exports.selectOptionInMdSelectByText = function(model, textToFind) {

    // Click the md-select.
    exports.clickElementByModel(model);

    // Wait for the rendering to complete.
    browser.waitForAngular();

    // Interate through all <md-option> on the page.
    element.all(by.css('md-option')).each(function(option) {
        var innerElement = option.element(by.css('div.md-text'));
        innerElement.getText().then(function(text) {
            if (text === textToFind) {

                // Found the text - now click it.
                innerElement.click();

                // Wait for rendering to complete.
                browser.waitForAngular();
            }
        });
    });
};
