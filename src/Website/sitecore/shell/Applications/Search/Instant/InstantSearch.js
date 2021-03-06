﻿var InstantSearch = Class.create({
  initialize: function(control) {
    if (!control) {
      return; /* index or searchbox is not available */
    }
  
    this.control = $(control);
    this.results = new Array();
    this.popupWidth = 350;
    this.requestVersion = 0;
    this.displayVersion = 0;
    
    this.control.observe("keydown", this.onKeyDown.bindAsEventListener(this), true);
    this.control.observe("keyup", this.onKeyUp.bindAsEventListener(this));
    this.control.observe("focus", function(e) { $(e.target).addClassName("focus"); });
    
    this.control.observe("blur", function(e) { 
      $(e.target).removeClassName("focus"); 
      setTimeout(instantSearch.hide.bind(instantSearch), 250); 
    });
    
    Event.observe(window, "resize", this.onResize.bindAsEventListener(this));
    
    scForm.registerKey("c191", "javascript:instantSearch.focus();");
  },

  setTimer: function() {
    this.lastKeyPress = new Date();    
    
    if (!this.timerActive) {
      setTimeout(this.checkTimer.bind(this), "150");
      this.timerActive = true;
    }
  },
  
  checkTimer: function() {
    if (!this.lastKeyPress) {
      return;
    }

    var delta = new Date() - this.lastKeyPress;
    
    if (delta > 200) {
      this.search();
      this.timerActive = false;
    }
    else {
      setTimeout(this.checkTimer.bind(this), "150");
    }
  },
  
  search: function() {
    var query = $F(this.control).strip();
    if (!query || query.length < 2) {
      this.hide();
      return;
    }
    
    this.requestVersion++;
    var url = "/sitecore/shell/applications/search/instant/instantsearch.aspx?q=" + encodeURIComponent(query) + "&v=" + this.requestVersion;
    
    var request = new Ajax.Request(url, {
      onSuccess: function(transport) {
        var version = parseInt(request.getHeader('scVersion'));
        instantSearch.showResults(transport.responseText, version);
      },
      onFailure: function(transport, response) {
        scForm.browser.showModalDialog("/sitecore/shell/controls/error.htm", new Array(transport.responseText), "center:yes;help:no;resizable:yes;scroll:yes;status:no;");
        instantSearch.unregisterProgress();
      }
    });
    
    this.registerProgress(query);
  },
  
  showResults: function(html, version) {
    if (version < this.displayVersion) {
      return;
    }
    else {
      this.displayVersion = version;
    }
  
    if (this.popup) {
      this.popup.remove();
    }
    
    var div = new Element("div", { id: "InstantResults" });
    
    var popupWidth = this.popupWidth;
    div.setStyle({ width: popupWidth + "px" });
    div.innerHTML = "<table width='100%' cellpadding='0' cellspacing='0'><tr><td class='sidebar'></td><td class='results'></td></tr></table>";
    
    this.popup = div;
    
    this.onResize();
    
    this.popup.observe("keydown", this.onKeyDown.bindAsEventListener(this), true);
    this.popup.observe("keyup", this.onKeyUp.bindAsEventListener(this));

    $('Desktop').insert({ after: div });

    this.popup.down(".results").update(html);
    this.setActiveResult(0);
    
    this.parseResults();

    this.popup.style.visibility = 'visible';    
    
    this.unregisterProgress(version);
    this.showCloseButton();
    
    setTimeout("instantSearch.setActiveResult(0)", 25);
  },
  
  parseResults: function() {
    this.results.clear();
    
    $$("#InstantResults li").each(function(element, index) {
      element.resultIndex = index;
      this.results.push(element);
      
      element.observe("mouseover", function(e) {
        var element = e.target;
        if (element.resultIndex != null) {
          this.setActiveResult(element.resultIndex);
        }
      }.bindAsEventListener(this));
      
      element.observe("click", function(e) {
        e.stop();
        this.launch();
      }.bindAsEventListener(this));
      
    }.bind(this));
    
    $$("#InstantResults ul .category").each(function(element) {
      element.setStyle({ left: "-" + (element.getWidth() + 6) + "px" });
    }.bind(this));    
  },
  
  setActiveResult: function(index) {
    this.results.each(function(result, resultIndex) {
      if (index == resultIndex) {
        result.addClassName("active");
      }
      else {
        result.removeClassName("active");
      }
    });
    
    this.activeResultIndex = index;
  },
  
  hide: function(immediate) {
    if (this.popup) {
      if (immediate) {
        this.popup.setStyle({ visibility: "hidden"});
      }
      else {
        new Effect.Opacity(this.popup, { 
          from: 1, 
          to: 0, 
          duration: 0.2,
          afterFinish: function(o) { if(instantSearch.popup) instantSearch.popup.remove(); }
        });
      }
    }
    
    this.unregisterProgress();
    this.hideCloseButton();
  },
  
  launch: function() {
    if (this.results.length == 0) {
      this.launchClassic();
      return;
    }
    
    if ($(this.results[0]).hasClassName("empty")) {
      return;
    }
  
    var result = this.results[this.activeResultIndex];
    
    var click = result.down("a").href;
    click = click.substring(click.indexOf("#") + 1);

    if (click.startsWith("javascript:")) {
      click = click.substring("javascript:".length);
      eval(click);
    }
    else {
      var message = "search:launchresult(url=" + click + ")";
      scForm.postRequest("", "", "", message);
    }
    this.hide();
  },
  
  launchClassic: function() {
    var query = $F(this.control).strip();
    var message = "system:search(query=" + query + ")";
    scForm.postRequest("", "", "", message);
  },
  
  nextResult: function() {
    var newIndex = this.activeResultIndex + 1;
    if (newIndex == this.results.length) {
      newIndex = 0;
    }
    
    this.setActiveResult(newIndex);
  },
  
  previousResult: function() {
    var newIndex = this.activeResultIndex - 1;
    if (newIndex < 0) {
      newIndex = this.results.length - 1;
    }
    
    this.setActiveResult(newIndex);
  },
  
  focus: function() {
    this.control.focus();
    this.control.select();
  },
  
  onKeyDown: function(e) {
    switch(e.keyCode) {
      case Event.KEY_DOWN:
        e.stop();
        this.nextResult();        
        break;
      case Event.KEY_UP:
        e.stop();
        this.previousResult();
        break;
      case Event.KEY_RETURN:
        e.stop();
        this.launch();
        break;
      case Event.KEY_ESC:
        this.hide();
        e.stop();
        break;
    }    
  },
  
  onKeyUp: function(e) {
    if (scForm.isFunctionKey(e, false)) {
      return;
    }
    
    var key = e.keyCode;   
    if (key == Event.KEY_RETURN) {
      return;
    }
    
    this.setTimer();
  },
  
  onResize: function() {
    var offset = Position.cumulativeOffset(this.control);
    var popupWidth = this.popupWidth;
    var controlWidth = this.control.getWidth();
        
    if (this.popup) {
      this.popup.setStyle({ left: offset[0] - popupWidth + controlWidth + "px", bottom: $("Startbar").getHeight() - 1 + "px" });
    }
    if (this.progress) {
      this.progress.setStyle({ left: offset[0] + controlWidth - 18, top: offset[1] + 2 });
    }
    if (this.closeButton) {
      this.closeButton.setStyle({ left: offset[0] + controlWidth - 17, top: offset[1] + 3 });
    }
  },
  
  showCloseButton: function() {
    if (!this.closeButton) {
      this.closeButton = new Element("img", { src: "/sitecore/shell/themes/standard/images/progress/globalsearch_close.png", alt: "", height: "16", width: "16" });
      this.closeButton.setStyle({ position: "absolute", cursor: "pointer" });
      this.closeButton.observe("click", function(e) { instantSearch.hide(); });
      this.closeButton.observe("mouseover", function(e) { e.target.src = '/sitecore/shell/themes/standard/images/progress/globalsearch_close_h.png'; });
      this.closeButton.observe("mouseout", function(e) { e.target.src = '/sitecore/shell/themes/standard/images/progress/globalsearch_close.png'; });
            
      this.onResize();
      $('Desktop').insert({ after: this.closeButton });
    }
    
    this.closeButton.show();
  },
  
  hideCloseButton: function() {
    if (this.closeButton) {
      this.closeButton.hide();
    }
  },
  
  registerProgress: function(query) {
    if (!this.progress) {
      this.progress = new Element("img", { src: "/sitecore/shell/themes/standard/images/progress/globalsearch_progress.gif", alt: "", height: "16", width: "16" });
      this.progress.setStyle({ position: "absolute" });
      this.onResize();
      $('Desktop').insert({ after: this.progress });
    }
    
    this.hideCloseButton();
    this.progress.show();
  },
  
  unregisterProgress: function(version) {
    if (this.progress) {
      this.progress.hide();
    }
  }
});

var instantSearch = null;
Event.observe(window, "load", function() { instantSearch = new InstantSearch($("SearchBox")); });