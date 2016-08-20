var chore = chore || {};
(function () {
  function requiredValid($element, id) {
    var val = $element.val();
    if (!val) {
      $element.after("<span class='error val-required' data-for-required='" + id + "'>This field is required.</span>");
      return false;
    }
    return true;
  }
  function noWhitespaceValid($element, id) {
    var allWhitespaceRegEx = new RegExp("^\\s*$");
    var val = $element.val();
    if (val && val.length && allWhitespaceRegEx.test(val)) {
      $element.after("<span class='error val-nowhitespace' data-for-nowhitespace='" + id + "'>Must type characters other than space/tab.</span>");
      return false;
    }
    return true;
  }
  function atLeastOneValid(id) {
    var valid = false;
    $("*[val-atleastone='" + id + "']").each(function (idx, elem) {
      var $elem = $(elem);
      if ($elem.prop("checked") === true) {
        valid = true;
      }
    });
    if (!valid) {
      $(".atleastonemsg[data-for='" + id + "'").append("<span class='error val-atleastone' data-for-atleastone='" + id + "'>At least one item must be selected.</span>");
    }
    return valid;
  }
  function makeRequired($element, id) {
    var obj = {};
    $element.off('keyup.tri-required');
    obj.isValid = function () {
      $element.on('keyup.tri-required', function () {
        $(".error[data-for-required='" + id + "'").remove();
        requiredValid($element, id);
      });
      return requiredValid($element, id);
    }
    return obj;
  }
  function makeNoWhitespace($element, id) {
    var obj = {};
    $element.off('keyup.tri-whitespace');
    obj.isValid = function () {
      $element.on('keyup.tri-whitespace', function () {
        $(".error[data-for-nowhitespace='" + id + "'").remove();
        noWhitespaceValid($element, id);
      });
      return noWhitespaceValid($element, id);
    }
    return obj;
  }
  function makeAtLeastOne(id) {
    var obj = {};
    $("*[val-atleastone='" + id + "']").off('click.tri-atleastone');
    obj.isValid = function () {
      $("*[val-atleastone='" + id + "']").on("click.tri-atleastone", function () {
        $(".atleastonemsg[data-for='" + id + "'").children().remove();
        atLeastOneValid(id);
      });
      return atLeastOneValid(id);
    }
    return obj;
  }
  function findRequired(validator, $element) {
    $element.find("*[val-required]").each(function (idx, requireElem) {
      var $requireElem = $(requireElem);
      var id = $requireElem.attr("id");
      if (!id) {
        return;
      }
      if (!validator.byId.hasOwnProperty(id)) {
        validator.byId[id] = [];
      }
      validator.byId[id].push(makeRequired($requireElem, id));
    });
  }
  function findNoWhitespace(validator, $element) {
    $element.find("*[val-nowhitespace]").each(function (idx, noSpaceElem) {
      var $noSpaceElem = $(noSpaceElem);
      var id = $noSpaceElem.attr("id");
      if (!id) {
        return;
      }
      if (!validator.byId.hasOwnProperty(id)) {
        validator.byId[id] = [];
      }
      validator.byId[id].push(makeNoWhitespace($noSpaceElem, id));
    });
  }
  function findAtLeastOne(validator, $element) {
    var atLeastGroups = {};
    $element.find("*[val-atleastone]").each(function (idx, atLeastElem) {
      var $atLeastElem = $(atLeastElem);
      var groupName = $atLeastElem.attr("val-atleastone");
      atLeastGroups[groupName] = true;
    });
    for (var key in atLeastGroups) {
      if (!validator.byId.hasOwnProperty(key)) {
        validator.byId[key] = [];
      }
      validator.byId[key].push(makeAtLeastOne(key));
    }
  }
  chore.validator = function ($element) {
    var validator = {};
    validator.byId = {};
    findRequired(validator, $element);
    findNoWhitespace(validator, $element);
    findAtLeastOne(validator, $element);
    $element.find(".error").remove();
    validator.validate = function () {
      $element.find(".error").remove();
      var isValid = true;
      for (var key in validator.byId) {
        var validators = validator.byId[key];
        for (var i = 0; i < validators.length; ++i) {
          var fieldValidator = validators[i];
          if (!fieldValidator.isValid()) {
            isValid = false;
          }
        }
      }
      return isValid;
    }
    return validator;
  }
}());