import { Notice, Plugin, PluginSettingTab, Setting } from "obsidian"

/**
 * @typedef {{
 *   mySetting: string
 * }} MyPluginSettings
 */
const DEFAULT_SETTINGS = {
	mySetting: "default",
}

export default class MyPlugin extends Plugin {
	/** @type {MyPluginSettings} settings */
	settings

	async onload() {
		await this.loadSettings()

		const ribbonIconEl = this.addRibbonIcon("dice", "ROLL DA DICE", (evt) => {
			new Notice(`ur random numbre: ${1 + Math.floor(Math.random() * 6)}`)
		})
		ribbonIconEl.addClass("my-plugin-ribbon-class")

		this.addRibbonIcon("crosshair", "Print leaf types", () => {
			this.app.workspace.iterateAllLeaves((leaf) => {
				console.log(leaf.getViewState().type)
			})
		})

		this.addSettingTab(new SampleSettingTab(this.app, this))
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}

class SampleSettingTab extends PluginSettingTab {
	/** @type {MyPlugin} plugin */
	plugin

	/**
	 * @param {import("obsidian").App} app
	 * @param {MyPlugin} plugin
	 */
	constructor(app, plugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display() {
		const { containerEl } = this

		containerEl.empty()

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value
						await this.plugin.saveSettings()
					}),
			)
	}
}
