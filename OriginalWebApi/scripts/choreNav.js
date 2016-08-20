var chore = chore || {};
(function () {
  chore.initNav = function () {
    //style top-level buttons depending on which sections are visible
    //according to css styles
    $("#panelSelection *[data-tri-panel]").each(function (idx, panelBtn) {
      var $panelBtn = $(panelBtn);
      var actualPanelSelector = $panelBtn.attr("data-tri-panel");
      var $actualPanel = $("#" + actualPanelSelector);
      if ($actualPanel.is(":visible")) {
        $panelBtn.addClass("btn-primary");
      }
    });
    //register event handler to toggle panels hidden/show and update button
    //styles as the top-level buttons are clicked.
    $("#panelSelection *[data-tri-panel]").click(function (evt) {
      var $panelBtn = $(evt.target);
      var actualPanelSelector = $panelBtn.attr("data-tri-panel");
      var $actualPanel = $("#" + actualPanelSelector);
      if ($panelBtn.hasClass("btn-primary")) {
        $panelBtn.removeClass("btn-primary");
        $actualPanel.slideUp();
      } else {
        $panelBtn.addClass("btn-primary");
        $actualPanel.slideDown();
      }
    });
  };
}());