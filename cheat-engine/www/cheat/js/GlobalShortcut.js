import {Key} from './KeyCodes.js'
import {Alert} from './AlertHelper.js'
import {cloneObject} from './Tools.js'
import {SpeedCheat, SceneCheat, GeneralCheat, BattleCheat, MessageCheat} from './CheatHelper.js'
import {ShortcutMap} from './ShortcutHelper.js'

// default shortcut settings
const defaultShortcutSettings = {
    toggleCheatModal: {
        shortcut: 'ctrl c'
    },

    toggleCheatModalToSaveLocationComponent: {
        shortcut: 'ctrl m'
    },

    quickSave: {
        shortcut: 'ctrl s',
        param: {
            slot: 1 // 1-indexed
        }
    },

    quickLoad: {
        shortcut: 'ctrl q',
        param: {
            slot: 1 // 1-indexed
        }
    },

    openSaveScene: {
        shortcut: 'ctrl ['
    },

    openLoadScene: {
        shortcut: 'ctrl ]'
    },

    gotoTitle: {
        shortcut: 'ctrl t'
    },

    forceVictory: {
        shortcut: 'ctrl v'
    },

    forceDefeat: {
        shortcut: 'ctrl d'
    },

    forceEscape: {
        shortcut: 'ctrl e'
    },

    toggleNoClip: {
        shortcut: 'alt w'
    },

    enemyWound: {
        shortcut: 'alt 1'
    },

    enemyRecovery: {
        shortcut: 'alt 0'
    },

    partyWound: {
        shortcut: 'alt 2'
    },

    partyRecovery: {
        shortcut: 'alt 9'
    },

    setSpeed: {
        shortcut: '', // no keymap
        param: {
            speed: 5
        }
    },

    skipMessage: {
        shortcut: '',
        param: {
            accelerate: 1
        }
    },

    openDevTool: {
        shortcut: 'f12'
    }
}

export function isInValueInRange(value, lowerBound, upperBound) {
    try {
        value = Number(value)
    } catch (err) {
        return '值必须是数字'
    }

    if (isNaN(value) || !Number.isInteger(value)) {
        return '值必须是数字'
    }

    if (value < lowerBound || upperBound < value) {
        return `值必须在 [${lowerBound}, ${upperBound}] 之间`
    }

    return false
}

// immutable
const shortcutConfig = {
    toggleCheatModal: {
        name: '切换作弊窗口',
        desc: '按键必须绑定',
        necessary: true,
        enterAction (param) {
            GeneralCheat.toggleCheatModal()
        }
    },

    toggleCheatModalToSaveLocationComponent: {
        name: '切换 "坐标" 选项卡',
        desc: '',
        enterAction (param) {
            GeneralCheat.toggleCheatModal('save-recall-panel')
        }
    },

    quickSave: {
        name: '快速保存',
        desc: '快速保存指定存档',
        param: {
            slot: {
                name: '槽位',
                desc: '存档槽位',
                isInvalidValue (value) {
                    return isInValueInRange(value, 1, DataManager.maxSavefiles())
                },
                convertValue (value) {
                    return Number(value)
                }
            }
        },
        enterAction (param) {
            SceneCheat.quickSave(param.slot)
        }
    },

    quickLoad: {
        name: '快速加载',
        desc: '快速加载指定存档',
        param: {
            slot: {
                name: '槽位',
                desc: '存档槽位',
                isInvalidValue (value) {
                    return isInValueInRange(value, 1, DataManager.maxSavefiles())
                },
                convertValue (value) {
                    return Number(value)
                }
            }
        },
        enterAction (param) {
            SceneCheat.quickLoad(param.slot)
        }
    },

    openSaveScene: {
        name: '打开存档界面',
        desc: '',
        enterAction (param) {
            SceneCheat.toggleSaveScene()
        }
    },

    openLoadScene: {
        name: '打开读档界面',
        desc: '',
        enterAction (param) {
            SceneCheat.toggleLoadScene()
        }
    },

    gotoTitle: {
        name: '返回标题界面',
        desc: '',
        enterAction (param) {
            SceneCheat.gotoTitle()
        }
    },

    forceVictory: {
        name: '强制战斗胜利',
        desc: '',
        enterAction (param) {
            BattleCheat.victory()
        }
    },

    forceDefeat: {
        name: '强制战斗失败',
        desc: '',
        enterAction (param) {
            BattleCheat.defeat()
        }
    },

    forceEscape: {
        name: '强制战斗逃跑',
        desc: '',
        enterAction (param) {
            BattleCheat.escape()
        }
    },

    toggleNoClip: {
        name: '切换至不锁定',
        desc: '',
        enterAction (param) {
            GeneralCheat.toggleNoClip(true)
        }
    },

    enemyWound: {
        name: '设置敌人血量为1',
        desc: '',
        enterAction (param) {
            BattleCheat.changeAllEnemyHealth(1)
        }
    },

    enemyRecovery: {
        name: '敌人全回复',
        desc: '补充全部HP/MP',
        enterAction (param) {
            BattleCheat.recoverAllEnemy()
        }
    },

    partyWound: {
        name: '设置同伴血量为1',
        desc: '',
        enterAction (param) {
            BattleCheat.changeAllPartyHealth(1)
        }
    },

    partyRecovery: {
        name: '同伴全回复',
        desc: '补充全部HP/MP',
        enterAction (param) {
            BattleCheat.recoverAllParty()
        }
    },

    setSpeed: {
        name: '速度',
        desc: '设置指定速度',
        param: {
            speed: {
                name: '速度',
                desc: '速度大小',
                isInvalidValue (value) {
                    return isInValueInRange(value, 1, 10)
                },
                convertValue (value) {
                    return Number(value)
                }
            }
        },
        enterAction (param) {
            SpeedCheat.removeFixSpeedInterval()
            SpeedCheat.setSpeed(param.speed)
        }
    },

    skipMessage: {
        name: '加速',
        desc: '',
        combiningKeyAlone: true,
        param: {
            accelerate: {
                name: '加速游戏速率',
                desc: '加速倍率',
                isInvalidValue (value) {
                    return isInValueInRange(value, 1, 50)
                },
                convertValue (value) {
                    return Number(value)
                }
            }
        },
        enterAction (param) {
            MessageCheat.startSkip(param.accelerate)
        },

        leaveAction (param) {
            MessageCheat.stopSkip()
        }
    },

    openDevTool: {
        name: '打开开发工具',
        desc: '打开Chromium开发工具',
        enterAction (param) {
            if (Utils.isNwjs()) {
                require('nw.gui').Window.get().showDevTools()
            }
        }
    }
}

class ShortcutConfig {
    constructor (id, config) {
        this.id = id

        const fields = ['name', 'desc', 'necessary', 'combiningKeyAlone', 'param', 'enterAction', 'repeatAction', 'leaveAction']

        for (const field of fields) {
            this[field] = config[field]
        }

        if (!this.necessary) this.necessary = false
        if (!this.combiningKeyAlone) this.combiningKeyAlone = false
        if (!this.param) this.param = {}
        if (!this.enterAction) this.enterAction = (param) => {}
        if (!this.repeatAction) this.repeatAction = (param) => {}
        if (!this.leaveAction) this.leaveAction = (param) => {}

    }

    getEnterAction (shortcutSetting) {
        return () => {
            this.enterAction(shortcutSetting.param)
        }
    }

    getRepeatAction (shortcutSetting) {
        return () => {
            this.repeatAction(shortcutSetting.param)
        }
    }

    getLeaveAction (shortcutSetting) {
        return () => {
            this.leaveAction(shortcutSetting.param)
        }
    }
}

/**
 * parse string written keymap to Key object
 *
 * @param src: string written keymap
 * @param dest: object which Key objects be stored
 */
function parseStringToKeyObject(src) {
    const ret = cloneObject(src)

    for (const key of Object.keys(src)) {
        ret[key].shortcut = Key.fromString(src[key].shortcut)
    }

    return ret
}


function parseKeyObjectToString(src) {
    const ret = cloneObject(src)

    for (const key of Object.keys(src)) {
        ret[key].shortcut = src[key].shortcut.asString()
    }

    return ret
}


class GlobalShortcut {
    constructor () {
        this.initialize()
    }

    initialize () {
        console.log('__global shortcut initialized')

        this.shortcutSettingsFile = './www/cheat-settings/shortcuts.json'

        // initialize shortcut settings
        this.shortcutSettings = {}
        this.readShortcutSettings()

        // initialize shortcut config
        this.shortcutConfig = {}
        this.initializeShortcutConfig()

        // migrate if settings file is old version
        this.migrateShortcutSettings()

        // initialize shortcut map
        this.shortcutMap = new ShortcutMap()
        this.initializeShortcutMap()
    }

    initializeShortcutConfig () {
        this.shortcutConfig = {}

        for (const key of Object.keys(shortcutConfig)) {
            this.shortcutConfig[key] = new ShortcutConfig(key, shortcutConfig[key])
        }
    }

    migrateShortcutSettings () {
        let defaultSettings = null
        const assignedKeys = new Set(Object.values(this.shortcutSettings).map(setting => setting.shortcut.asString()))

        for (const shortcutConfig of Object.values(this.shortcutConfig)) {
            if (!Object.hasOwnProperty.call(this.shortcutSettings, shortcutConfig.id)) {
                // initialize default settings if not initialized
                if (!defaultSettings) {
                    defaultSettings = parseStringToKeyObject(defaultShortcutSettings)
                }

                // handle conflict keys
                const defaultSetting = defaultSettings[shortcutConfig.id]
                if (!defaultSetting.shortcut.isEmpty() && assignedKeys.has(defaultSetting.shortcut.asString())) {
                    console.warn(`key conflicts while migrating : ${shortcutConfig.name} - ${defaultSetting.shortcut.asString()}`)
                    defaultSetting.shortcut = Key.createEmpty()
                }

                assignedKeys.add(defaultSetting.shortcut.asString())

                this.shortcutSettings[shortcutConfig.id] = defaultSettings[shortcutConfig.id]
            }
        }

        // if settings migrated, save to file
        if (defaultSettings) {
            console.warn('__settings migrated')
            this.writeShortcutSettings()
        }
    }

    initializeShortcutMap () {
        for (const shortcutConfig of Object.values(this.shortcutConfig)) {
            const shortcutSetting = this.shortcutSettings[shortcutConfig.id]

            this.shortcutMap.register(shortcutSetting.shortcut, shortcutConfig,
                shortcutConfig.getEnterAction(shortcutSetting), shortcutConfig.getRepeatAction(shortcutSetting), shortcutConfig.getLeaveAction(shortcutSetting))
        }
    }

    runKeyEnterEvent (e, key) {
        if (this.shortcutMap.runEnterAction(key)) {
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()
        }
    }

    runKeyRepeatEvent (e, key) {
        if (this.shortcutMap.runRepeatAction(key)) {
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()
        }
    }

    runKeyLeaveEvent (e, key) {
        if (this.shortcutMap.runLeaveAction(key)) {
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()
        }
    }

    /**
     * read raw shortcut settings
     *
     */
    readRawShortcutSettings () {
        // if nwjs environment, read shortcut settings from file
        if (Utils.isNwjs()) {
            const fs = require('fs')
            const path = require('path')

            try {
                // read settings file
                return JSON.parse(fs.readFileSync(this.shortcutSettingsFile, 'utf-8'))
            } catch (err) {
                try {
                    // create default settings file
                    this.writeRawShortcutSettings(defaultShortcutSettings)

                    // read created file
                    return JSON.parse(fs.readFileSync(this.shortcutSettingsFile, 'utf-8'))
                } catch (fileWriteErr) {
                    Alert.warn('Can\'t initialize shortcut settings file. Use internal data instead.\n(You can use cheat plugin anyway)', err)
                    return defaultShortcutSettings
                }
            }
        }

        // if using browser, read default shortcut settings
        console.warn('[cheat plugin warn] Use default settings')
        return defaultShortcutSettings
    }

    /**
     * read and parse shortcut settings
     */
    readShortcutSettings () {
        const rawSettings = this.readRawShortcutSettings()
        this.shortcutSettings = {}

        try {
            this.shortcutSettings = parseStringToKeyObject(rawSettings)
        } catch (err) {
            Alert.warn('无法解析快捷按键配置。使用默认配置。\n\(你可以任意使用作弊插件\))', err)

            try {
                this.shortcutSettings = parseStringToKeyObject(defaultShortcutSettings)
            } catch (err) {
                Alert.error('无法解析快捷按键配置。作弊插件无法正常工作', err)
            }
        }
    }

    writeRawShortcutSettings (shortcutSettings) {
        if (Utils.isNwjs()) {
            const fs = require('fs')
            const path = require('path')

            // remove previous settings file
            try {
                fs.unlinkSync(this.shortcutSettingsFile)
            } catch (e) {
            }

            // create parent directory if not exists
            const parentDir = path.dirname(this.shortcutSettingsFile)

            if (!fs.existsSync(parentDir)) {
                fs.mkdirSync(parentDir, {recursive: true})
            }

            // create file
            fs.writeFileSync(this.shortcutSettingsFile, JSON.stringify(shortcutSettings, null, 2))
        }
    }

    writeShortcutSettings () {
        this.writeRawShortcutSettings(parseKeyObjectToString(this.shortcutSettings))
    }

    restoreDefaultSettings () {
        if (Utils.isNwjs()) {
            // remove settings file
            try {
                require('fs').unlinkSync(this.shortcutSettingsFile)
            } catch (e) {
            }

            this.initialize()
        }
    }

    getSettings (shortcutId) {
        return this.shortcutSettings[shortcutId]
    }

    getConfig (shortcutId) {
        return this.shortcutConfig[shortcutId]
    }

    getParamConfig (shortcutId, paramId) {
        return this.getConfig(shortcutId).param[paramId]
    }

    getParam (shortcutId, paramId) {
        return this.getSettings(shortcutId).param[paramId]
    }

    getShortcut (shortcutId) {
        return this.getSettings(shortcutId).shortcut
    }

    setShortcut (shortcutId, newKey) {
        // not need to change shortcut
        const prevKey = this.getShortcut(shortcutId)
        if (prevKey.equals(newKey)) {
            return
        }

        const existingValue = this.shortcutMap.getValue(newKey)
        if (existingValue) {
            throw Error(`快捷键冲突 : [${newKey.asDisplayString()}] ${existingValue.name}`)
        }

        // remove prev key binding if prev key exists
        this.shortcutMap.remove(prevKey)

        // bind key
        const currValue = this.getConfig(shortcutId)
        const currSettings = this.getSettings(shortcutId)
        this.shortcutMap.register(newKey, currValue,
            currValue.getEnterAction(currSettings), currValue.getRepeatAction(currSettings), currValue.getLeaveAction(currSettings))

        // change settings
        currSettings.shortcut = newKey

        // write changed settings
        this.writeShortcutSettings()
    }

    setParam (shortcutId, paramId, newValue) {
        const paramConfig = this.getParamConfig(shortcutId, paramId)

        const invalidMsg = paramConfig.isInvalidValue(newValue)

        if (invalidMsg) {
            throw Error(invalidMsg)
        }

        this.getSettings(shortcutId).param[paramId] = paramConfig.convertValue(newValue)

        this.writeShortcutSettings()
    }
}

export const GLOBAL_SHORTCUT = new GlobalShortcut()
