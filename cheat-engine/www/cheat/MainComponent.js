import CheatModal from './CheatModal.js'
import { GLOBAL_SHORTCUT } from "./js/GlobalShortcut.js"
import { GeneralCheat } from './js/CheatHelper.js'
import AlertSnackbar from './components/AlertSnackbar.js'
import ConfirmDialog from './components/ConfirmDialog.js'
import { customizeRPGMakerFunctions } from './init/customize_functions.js'

export default {
    name: 'MainComponent',
    components: { CheatModal, AlertSnackbar, ConfirmDialog },
    template: `
<div 
    class="pa-2"
    ref="rootDiv">
    <v-fade-transition leave-absolute>
        <cheat-modal
            id="cheat-modal"
            class="opaque-on-mouseover"
            v-model="currentComponentName"
            v-if="show"
            >
        </cheat-modal>
    </v-fade-transition>
    <alert-snackbar></alert-snackbar>
    <confirm-dialog></confirm-dialog>
</div>`,

    style: `
    #cheat-modal: {
        opacity: 0.7;
    }
    `,

    data () {
        return {
            show: false,
            currentComponentName: null
        }
    },

    created () {
        const self = this

        GeneralCheat.toggleCheatModal = (componentName = null) => {
            this.toggleCheatModal(componentName)
        }

        GeneralCheat.openCheatModal = (componentName = null) => {
            this.openCheatModal(componentName)
        }

        window.addEventListener('keydown', this.onGlobalKeyDown)

        customizeRPGMakerFunctions()
        // // WARN: directly changing engine code can be dangerous
        // // remove preventDefault
        // TouchInput._onWheel = function () {
        //     this._newState.wheelX += event.deltaX
        //     this._newState.wheelY += event.deltaY
        // }
        //
        // // ignore click event when cheat modal shown and click inside cheat modal
        // const TouchInput_onMouseDown = TouchInput._onMouseDown
        // TouchInput._onMouseDown = function(event) {
        //     if (self.show) {
        //         const bcr = document.querySelector('#cheat-modal').getBoundingClientRect();
        //         if (bcr.left <= event.clientX && event.clientX <= bcr.left + bcr.width
        //             && bcr.top <= event.clientY && event.clientY <= bcr.top + bcr.height) {
        //             return
        //         }
        //     }
        //
        //     TouchInput_onMouseDown.call(this, event)
        //
        //     // if (event.button === 0) {
        //     //     this._onLeftButtonDown(event);
        //     // } else if (event.button === 1) {
        //     //     this._onMiddleButtonDown(event);
        //     // } else if (event.button === 2) {
        //     //     this._onRightButtonDown(event);
        //     // }
        // }
    },

    beforeDestroy () {
        window.removeEventListener('keydown', this.onGlobalKeyDown)

    },

    watch: {
        show: {
            immediate: true,
            handler (value) {
            }
        }
    },

    methods: {
        onGlobalKeyDown (e) {
            GLOBAL_SHORTCUT.runKeyEvent(e)
        },

        openCheatModal (componentName) {
            if (componentName) {
                this.currentComponentName = componentName
            }

            this.show = true
        },

        toggleCheatModal (componentName) {
            const prevComponentName = this.currentComponentName

            if (componentName) {
                this.currentComponentName = componentName
            }

            // close
            if (this.show) {
                // hide modal if only componentName unchanged
                if (!componentName || componentName === prevComponentName) {
                    this.show = false
                }
                return
            }

            // open
            this.show = true
        }
    }
}
