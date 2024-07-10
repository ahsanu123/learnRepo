import './style.scss'
import SlickLearn from './slickgrid-uni'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <h1>My First Grid</h1>
    <div id="myGrid" class="slick-container" style="width:500px;height:500px;" >
    </div>
`
new SlickLearn().onRender()
