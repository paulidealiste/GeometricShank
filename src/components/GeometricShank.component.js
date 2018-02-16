import GeometricShankToolbar from './GeometricShankToolbar.component';

export default ({
  template: `
  <div>
    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">
          <ul class="uk-navbar-nav">
            <li class="uk-active">
                 <a href="#">
                     <div>
                         <span class="uk-text-bold">Geometric shank</span>
                         <div class="uk-navbar-subtitle">Cut-up method spike</div>
                     </div>
                 </a>
             </li>
          </ul>
      </div>
    </nav>
    <geometric-shank-toolbar></geometric-shank-toolbar>
  </div>
  `,
  components: {
    'geometric-shank-toolbar': GeometricShankToolbar
  }
})
