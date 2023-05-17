import style from './table.css?inline'

/**
 * s2 table的template
 */
const tableTemplate = `
<template id="root">
    <style>
    ${style}
    </style>
    <div id="s2-table-container">    
        <div class="s2-table"></div>
        <div class="s2-table__loading"></div>
    </div>
</template>
`;

export class S2Table extends HTMLElement {
	constructor() {
		super();

       this.attachShadow({ mode: "open" })
       if(!this.shadowRoot) return

		this.shadowRoot.innerHTML = tableTemplate;

        const template = this.shadowRoot.getElementById('root') as HTMLTemplateElement

        if(!template) return

        const templateContent = template.content;

        this.shadowRoot.appendChild(
            templateContent.cloneNode(true)
        );
	}
}
