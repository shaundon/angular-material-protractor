let config = {
    stupidMDSelectSleepTimeoutMS: 300,
    stupidMDMenuSleepTimeoutMS: 300
};

// Checks if an <input> has the right value.
exports.checkValueOfTextFieldByModel = function(model, expected) {
    return exports.checkValueOfTextField(element(by.model(model)), expected);
};

exports.checkValueOfTextField = function(el, expected) {
    expect(el.getAttribute('value')).toBe(expected);
};

// Checks if an <md-checkbox> has the right value.
exports.checkValueOfMdCheckboxByModel = function(model, expected) {
    var foundElement = element(by.model(model));
    expect(foundElement.getAttribute('aria-checked')).toBe(expected);
};

exports.checkValueOfMdSelectByModel = function(model, expected) {
    const modelElement = element(by.model(model));
    return exports.checkValueOfMdSelect(modelElement, expected);
};

exports.checkTextOfMdSelectByModel = function(model, expected) {
    const modelElement = element(by.model(model));
    return exports.checkTextOfMdSelect(modelElement, expected);
};

// Checks if an <md-select> has the right value.
exports.checkValueOfMdSelect = function(mdSelect, expected) {
    const option = mdSelect.element(by.css('md-option[selected]'));
    const actual = option.getAttribute('value');
    expect(actual).toBe(expected);
};

exports.checkTextOfMdSelect = function(mdSelect, expected) {
    const foundElement = mdSelect.element(by.css('md-select-value span .md-text'));
    const actual = foundElement.getText();
    expect(actual).toBe(expected);
};

// Checks if an <md-chips> has the right values.
exports.checkValueOfMdChipsByModel = function(model, expected) {
    var resultingArray = [];
    element.all(by.css('md-chips[ng-model="' + model + '"] md-chip .md-chip-content span')).then(function(chips) {
        var totalChips = chips.length;
        var count = 0;
        for (let chip of chips) {
            chip.getText().then(function(text) {
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

exports.selectOptionInMdSelectByModelByText = (model, textToFind) => {
    return exports.selectOptionInMdSelectByText(element(by.model(model)), textToFind);
};

exports.selectOptionInMdSelectByText = (mdSelect, textToFind) => {
    const mdSelectOptions = by.css('.md-select-menu-container.md-active.md-clickable md-option');
    // click to open the dropdown
    mdSelect.click();
    // After the click on md-select, and before the options are clickable, MD puts in an odd overlay.
    // ... so we need to slow our browser down so it doesn't try and click the option too early.
    // Note: other solutions, like `browser.waitForAngular()` or `isElementPresent(mdSelectOptions)` aren't working.
    browser.sleep(config.stupidMDSelectSleepTimeoutMS);
    // Iterate through all visible <md-option> on the page.
    let matchingOption;
    element.all(mdSelectOptions).each((option) => {
        var innerElement = option.element(by.css('div.md-text'));
        innerElement.getText().then((text) => {
            if (text === textToFind) {
                if (matchingOption) {
                    throw new Error(`multiple md-select options matching the same ${textToFind}`);
                }
                // Found the right option - now click it.
                matchingOption = option;
            }
        });
    }).then(() => {
        if (!matchingOption) {
            throw new Error(`${textToFind} could not be found in md-select options: ${mdSelect.locator()}`);
        }
        matchingOption.click();
        browser.sleep(config.stupidMDSelectSleepTimeoutMS);
    });
};

exports.clickMDContextMenuItem = function (openContextMenu, text) {
    const menuItem = element(by.cssContainingText('.md-open-menu-container.md-active.md-clickable a', text));
    openContextMenu.click();
    browser.sleep(config.stupidMDMenuSleepTimeoutMS);
    menuItem.click()
};

exports.changeDefaultOptions = (options) => {
    Object.assign(config, options);
};
