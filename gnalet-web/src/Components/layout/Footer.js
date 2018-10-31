import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
        <div>
            <footer class="footer bg-primary">
                <div class="container "style={{height:'5%'}} >
                    <span class="text-muted">Place sticky footer content here.</span>
                </div>
            </footer>
        </div>
    )
  }
}
