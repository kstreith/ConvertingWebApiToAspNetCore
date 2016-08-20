var chore = chore || {};
(function () {
  chore.ajax = function (ajaxSettings) {
    var triDelay = ajaxSettings.triDelay; // || 5;
    var triStatusCode = ajaxSettings.triStatusCode; // || 500;
    ajaxSettings.headers = ajaxSettings.headers || {};
    if (triDelay) {
      ajaxSettings.headers["tri-delay"] = triDelay;
    }
    if (triStatusCode) {
      ajaxSettings.headers["tri-statusCode"] = triStatusCode;
    }
    var response = $.ajax(ajaxSettings);
    response.fail(function (jqXHR, textStatus, errorThrown) {
      if (textStatus === 'abort') {
        return;
      }
      if (jqXHR.status !== 500) {
        return;
      }
      chore.showErrorMessage('server failed, please retry.');
    });
    return response;
  }

  chore.escapeHTML = function (string) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  }
  chore.escapeHTMLJQuery = function (string) {
    return $("<div>").text(string).html();
  }
  chore.showModal = function ($elem) {
    $("<div class='tri-modal-overlay'></div>").appendTo("body");
    $elem.addClass("tri-modal-open");
  }
  chore.hideModal = function ($elem) {
    $(".tri-modal-overlay").remove();
    $elem.removeClass("tri-modal-open");
  }

  chore.showModalWindow = function (config) {
    $("<div class='tri-modal-overlay'></div>").appendTo("body");
    config.$element.addClass("tri-modal-open");
    var hide = function () {
      $(".tri-modal-overlay").remove();
      config.$element.removeClass("tri-modal-open");
    }
    config.$element.off("click.triModalOk").on("click.triModalOk", ".okButton", function (e) {
      var okCallback = config.okCallback || function () { };
      var result = okCallback();
      if (!result) {
        hide();
        var afterOkCallback = config.afterOkCallback || function () { };
        afterOkCallback();
      }
    });
    config.$element.off("click.triModalCancel").on("click.triModalCancel", ".cancelButton", function (e) {
      var cancelCallback = config.cancelCallback || function () { };
      var result = cancelCallback();
      if (!result) {
        hide();
      }
    });
  }

  chore.showErrorMessage = function (message) {
    var $appErrorContainer = $(".appErrorContainer");
    if (!$appErrorContainer.length) {
      $appErrorContainer = $("<div class='appErrorContainer'>").appendTo("body");
    }
    var AUTO_HIDE_DELAY = 5 * 1000; //5 seconds
    var $appError = $("<div class='appError'>").text(message);
    $appErrorContainer.prepend($appError);
    setTimeout(function () {
      $appError.remove();
    }, AUTO_HIDE_DELAY);
  }
  
  $.fn.walk = function(visit) {
      if(this.length === 0) { return; }
      this.each(function(i) {
          var $this = $(this);
          if (visit.call(this, $this, i) === false) { return false; }
          $this.children().walk(visit);
      });
  }

  chore._renderLoop = function ($loopContainer, parentViewModel) {
    var self = this;
    var $template = $loopContainer.data("triLoopTemplate");
    if (!$template) {
      $template = $loopContainer.children().detach();
      $loopContainer.data("triLoopTemplate", $template);
    }
    var propName = $loopContainer.attr("tri-repeat");
    var dataArray = parentViewModel[propName];
    $loopContainer.empty();
    if (!dataArray || !dataArray.length) {
      return;
    }
    var rowElements = [];
    for (var i = 0; i < dataArray.length; ++i) {
      var currentRowViewModel = dataArray[i];
      var $renderedTemplate = $template.clone();
      chore.executeTemplate($renderedTemplate, currentRowViewModel);
      rowElements.push($renderedTemplate);
    }
    $loopContainer.append(rowElements);
  }
  chore.executeTemplate = function ($element, viewModel) {
    var self = this;
    $element.walk(function ($curElement) {
      if ($curElement.attr("tri-repeat")) {
        var propName = $curElement.attr("tri-repeat");
        var data = viewModel[propName];
        chore._renderLoop($curElement, viewModel);
        if (viewModel.subscribe) {
          viewModel.subscribe(propName, function () {
            chore._renderLoop($curElement, viewModel);
          });
        }
        return false;
      }
      if ($curElement.attr("tri-value")) {
        var propName = $curElement.attr("tri-value");
        if (viewModel.hasOwnProperty(propName)) {
          var data = viewModel[propName];
          $curElement.val(data);
          if (viewModel.subscribe) {
            viewModel.subscribe(propName, function () {
              $curElement.val(viewModel[propName]);
            });
          }
          $curElement.on('blur', function () {
            viewModel[propName] = $curElement.val();
          });
        }
      }
      if ($curElement.attr("tri-text")) {
        var propName = $curElement.attr("tri-text");
        if (viewModel[propName]) {
          $curElement.text(viewModel[propName]);
        }
      }
      if ($curElement.attr("tri-show")) {
        var propName = $curElement.attr("tri-show");
        if (viewModel[propName] === true) {
          $curElement.show();
        }
        else {
          $curElement.hide();
        }
        if (viewModel.subscribe) {
          viewModel.subscribe(propName, function () {
            if (viewModel[propName] === true) {
              $curElement.show();
            }
            else {
              $curElement.hide();
            }
          });
        }
      }
      if ($curElement.attr("tri-class")) {
        var strConfig = $curElement.attr("tri-class");
        var config = JSON.parse(strConfig);
        if (viewModel[config.prop] === true) {
          $curElement.addClass(config.className);
        }
        else {
          $curElement.removeClass(config.className);
        }
      }
      if ($curElement.attr("tri-attr")) {
        var strConfig = $curElement.attr("tri-attr");
        var config = JSON.parse(strConfig);
        var configArray = [];
        if (config.length) {
          configArray = config;
        } else {
          configArray = [config];
        }
        configArray.forEach(function (config) {
          $curElement.attr(config.prop, viewModel[config.data]);
        });
      }
      if ($curElement.attr("tri-click")) {
        var funcName = $curElement.attr("tri-click");
        var func = viewModel[funcName];
        if (func && func.apply) {
          $curElement.off("click.tri").on("click.tri", function () {
            func.call(viewModel, viewModel);
          });
        }
      }
      if ($curElement.attr("tri-modal")) {
        var propName = $curElement.attr("tri-modal");
        if (viewModel.subscribe) {
          viewModel.subscribe(propName, function () {
            if (viewModel[propName] === true) {
              chore.showModal($curElement);
            }
            else {
              chore.hideModal($curElement);
            }
          });
        }
      }
    });
  }
  
}());