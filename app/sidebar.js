(function ($, undefined) {

define(function() {


var l10n = Upfront.Settings && Upfront.Settings.l10n ?
	/* ? */ Upfront.Settings.l10n.exporter :
	/* : */ Upfront.mainData.l10n.exporter
;

var SidebarCommands_PrimaryLayout = Upfront.Views.Editor.Commands.extend({
	"className": "sidebar-commands sidebar-commands-primary clearfix",
	initialize: function () {
		this.commands = _([
			new Command_InfoPanel({model: this.model}),
			new Command_LayoutModal({model: this.model}),

			new Command_ThemeImagesSprites({model: this.model}),
		]);
	}
});


var Command_InfoPanel = Upfront.Views.Editor.Command.extend({
	className: "info-panel",
	render: function () {
		var layout = Upfront.themeExporter.current_layout_label || Upfront.Application.layout.get("current_layout") || Upfront.Application.layout.get("layout"),
			info = _.isObject(layout) ? (layout.specificity || layout.item || layout.type) : layout
		;

		this.$el.html(
			l10n.current_layout.replace(/%s/, info)
		);
	}
});

var Command_LayoutModal = Upfront.Views.Editor.Command.extend({
	className: "command-browse-layout",
	render: function () {
		this.$el.html(l10n.layouts);
        this.$el.prop("title", l10n.layouts);
	},
	on_click: function () {
		Upfront.Events.trigger("command:layout:browse");
	}
});

var Command_ThemeImagesSprites = Upfront.Views.Editor.Command.extend({
	tagName: 'li',
	className: 'command-open-exporter_media',
	initialize: function () {
		this.events = _.extend({}, Upfront.Views.Editor.Command.prototype.events, {
			'click a.images': 'pop_images',
			'click a.sprites': 'pop_sprites'
		});
		Upfront.Views.Editor.Command.prototype.initialize.call(this);
	},
	render: function () {
		this.$el.html(
			'<a class="images" title="'+ l10n.media +'">' + l10n.theme_images + '</a>' +
			'<a class="sprites" title="'+ l10n.media +'">' + l10n.theme_sprites + '</a>'
		);
	},
	pop_images: function (e) {
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
		Upfront.Media.Manager.open({
			media_type: ["images"]
		});
	},
	pop_sprites: function (e) {
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
		Upfront.Media.Manager.open({
			media_type: ["images"],
			themeImages: true
		});
	}
});


function init_normal_exporter () {
	Upfront.Application.sidebar.sidebar_commands.primary = new SidebarCommands_PrimaryLayout({model: Upfront.Application.sidebar.model});
	Upfront.Application.sidebar.sidebar_commands.additional = false;

	Upfront.Application.sidebar.render();
}

function init_responsive_exporter () {
	var browse = new Command_LayoutModal({model: Upfront.Application.sidebar.model});
	if (Upfront.Application.sidebar.sidebar_commands.responsive.views[2].$el.is(".command-browse-layout")) {
		Upfront.Application.sidebar.sidebar_commands.responsive.views[2].remove();
		Upfront.Application.sidebar.sidebar_commands.responsive.views[2] = browse;
	} else {
		Upfront.Application.sidebar.sidebar_commands.responsive.views.splice(2, 0, browse);
	}

	Upfront.Application.sidebar.render();
}

function init () {
	Upfront.Events.on("application:mode:after_switch", function () {
		/*
		if (Upfront.Application.get_current() === Upfront.Settings.Application.MODE.RESPONSIVE) return init_responsive_exporter();
		if (Upfront.Application.get_current() === Upfront.Settings.Application.MODE.THEME) return init_normal_exporter();
		else return init_normal_exporter();
		*/
		return Upfront.Application.get_current() === Upfront.Settings.Application.MODE.RESPONSIVE ?
			/* ? */ init_responsive_exporter() :
			/* : */ init_normal_exporter()
		;
	});

	Upfront.Events.on('sidebar:add_classes', function(sidebarEl) {
		sidebarEl.addClass('create-theme-sidebar');
	});
}

return {
	init: init
};


});
})(jQuery);
