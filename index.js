const EC = protractor.ExpectedConditions;

const waitForElementToBeClickable = exports.waitForElementToBeClickable = function (element) {
    return browser.wait(EC.elementToBeClickable(element), 1000);
};

const waitForMDBackdropToDisappear = exports.waitForMDBackdropToDisappear = function () {
    return browser.wait(EC.not(EC.presenceOf($('md-backdrop'))), 1000);
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

exports.selectOptionInMdSelectByText = function(selectElm, text) {
    if (!selectElm.element) {
        selectElm = $(selectElm);
    }
    selectElm.click();
    waitForElementToBeClickable(selectElm);
    const mdSelectContainer = element(by.css('.md-select-menu-container.md-active.md-clickable'));
    let duplicateMatch = false;
    waitForElementToBeClickable(mdSelectContainer);
    return mdSelectContainer
        .all(by.css('md-option'))
        .filter(function (option) {
            return option.getText().then(function (optionText) {
                if (text === optionText) {
                    if (duplicateMatch) {
                        throw new Error(`multiple md-select options matching the same ${optionText}`);
                    } else {
                        duplicateMatch = true;
                        return true
                    }
                }
            });
        }).then(function (opt) {
            if (opt.length && opt[0].click) {
                opt[0].click();
                waitForMDBackdropToDisappear()
            } else {
                throw new Error(`no matching options found for text: ${text}`)
            }
        })
};

exports.clickMDContextMenuItem = function (openContextMenu, text) {
    const menuItem = element(by.cssContainingText('.md-open-menu-container.md-active.md-clickable a', text));
    waitForElementToBeClickable(openContextMenu);
    openContextMenu.click();
    waitForElementToBeClickable(menuItem);
    menuItem.click();
    waitForMDBackdropToDisappear()
};

exports.selectMdRadioButtonByText = (radioGroupElm, text) => {
  if (!radioGroupElm.element) {
    radioGroupElm = $(radioGroupElm);
  }
  return radioGroupElm
    .all(by.tagName('md-radio-button'))
    .filter(function(radioBtn) {
      return radioBtn.getText().then(function(radioText) {
        if (radioText === text) {
          return true;
        }
      })
    }).then(function(opt) {
      if (opt.length && opt[0].click) {
        opt[0].click();
      }
    })
  ;
};

exports.elementHasClass = (element, cls) => {
    return element.getAttribute('class').then((classes) => classes.split(' ').includes(cls));
};

exports.blurFieldAndCheckForError = (model, ngMessageType) => {
    const foundElement = element(by.model(model));

    // Press tab, which will blur the field.
    foundElement.sendKeys(protractor.Key.TAB);

    // Add a sleep because this stuff is inconsistent af.
    browser.sleep(500);

    // See if it has the error.
    expect(exports.elementHasClass(foundElement, `ng-invalid-${ngMessageType}`).toBeTruthy());
};

exports.blurFieldAndCheckIsValud = (model) => {
    const foundElement = element(by.model(model));

    // Press tab. This will blur the field in question.
    foundElement.sendKeys(protractor.Key.TAB);

    // Add a sleep because this stuff is inconsistent af.
    browser.sleep(500);

    // See if it has the error.
    expect(exports.elementHasClass(foundElement, 'ng-valid')).toBeTruthy();
};
