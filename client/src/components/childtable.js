import React, {Component} from 'react'
import { Link } from 'react-router-dom'
const axios = require('axios');
const auth = require('../utility/auth.service.js')



class Childtable extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      baseUrls: this.props.baseUrls ? this.props.baseUrls : [],
      alternetUrls: [],
      expendedRowUrl: {}
    }
    this.expendRowToggle = this.expendRowToggle.bind(this)
    this.getAlternetUrls = this.getAlternetUrls.bind(this)
  }

  expendRowToggle (url, row) {
    let currentDisplay = document.getElementById(`child-table-${row}`).style.display
    if(currentDisplay === 'block') {
      document.getElementById(`child-table-${row}`).style.display = 'none'
      document.getElementById(`icon-${row}`).classList.remove("fa-caret-down");
      document.getElementById(`icon-${row}`).classList.add("fa-caret-right");
    } else {
    this.props.baseUrls.forEach((url, i) => {
        if(i!==row) {
          document.getElementById(`row-${i}`).classList.remove("m-datatable__row--detail-expanded");
          document.getElementById(`icon-${i}`).classList.remove("fa-caret-down");
          document.getElementById(`icon-${i}`).classList.add("fa-caret-right");
          document.getElementById(`child-table-${i}`).style.display = 'none'
        } else {
          document.getElementById(`row-${row}`).classList.add("m-datatable__row--detail-expanded");
          document.getElementById(`icon-${row}`).classList.remove("fa-caret-right");
          document.getElementById(`icon-${row}`).classList.add("fa-caret-down");
          document.getElementById(`child-table-${row}`).style.display = 'block'
        }
    });
  }
    this.setState({expendedRowUrl: url})
    this.getAlternetUrls(url)
  }

  getAlternetUrls (url) {
    axios
        .get(`/urls/${url.id}`, {
          headers: {
        "Authorization": `${auth.default.getToken()}`,
        "userId": `${auth.default.getUserId()}`
      }
        })
        .then(res => {
            let data = []
            res.data.payload.forEach(element => {
                if (element.baseUrlId) {
                  let temp = { id: element.id, name: element.name, url: element.url, count: element.participentCount }
                  data.push(temp)
                }
            })
            this.setState({
                alternetUrls: data,
            })
        })
        .catch(err => {
          if(err.response.status === 401){
            window.location.reload();
          }
            console.log(err)
        })
  }

  componentWillReceiveProps(){
    if(this.state.expendedRowUrl && this.state.expendedRowUrl.id){
    this.getAlternetUrls(this.state.expendedRowUrl);
  }
}

  render () {
    return (
      <span>
      {this.props.baseUrls.length > 0
      ? <div className='form-row' style={{marginTop: '20px'}}>
      <input className="form-control m-input m-input--solid" onChange={this.props.search} type="text" placeholder="Search Group..." aria-label="Search" />
      <div
  className="m_datatable m-datatable m-datatable--default m-datatable--brand m-datatable--subtable m-datatable--loaded"
  id="child_data_local"
  style={{width: '100%', marginTop: '20px'}}
>
{this.props.baseUrls.length > 0
  ? <table
    className="m-datatable__table"
    id="m-datatable-urls"
    style={{ display: "block", height: "auto", overflowX: "auto" }}
  >
    <thead className="m-datatable__head">
      <tr className="m-datatable__row" style={{ height: '53px' }}>
        <th
          data-field="RecordID"
          className="m-datatable__cell--center m-datatable__cell"
        >
          <span style={{ width: '20px' }} />
        </th>
        <th
          data-field="groupName"
          className="m-datatable__cell m-datatable__cell--center"
        >
          <span style={{ width: '150px'}}>
            Group Name
          </span>
        </th>
        <th
          data-field="baseUrl"
          className="m-datatable__cell m-datatable__cell--center"
        >
          <span style={{ width: '150px' }}>Base URL</span>
        </th>
        <th
          data-field="alternetGroups"
          className="m-datatable__cell m-datatable__cell--center"
        >
          <span style={{ width: '150px' }}>Alternate Groups</span>
        </th>
        <th
          data-field="redirectLink"
          className="m-datatable__cell m-datatable__cell--center"
        >
          <span style={{ width: '150px' }}>Redirect Link</span>
        </th>
        <th
          data-field="actions"
          className="m-datatable__cell m-datatable__cell--center"
        >
          <span style={{ width: '150px' }}>Actions</span>
        </th>
      </tr>
    </thead>
    <tbody className="m-datatable__body" style={{}}>
     {
       this.props.baseUrls.map((url, i) =>
       (
         <span key={i}>
         <tr
           data-row={i}
           id = {`row-${i}`}
           className="m-datatable__row m-datatable__row--even"
           style={{ height: 55 }}
         >
           <td
             data-field="RecordID"
             className="m-datatable__cell--center m-datatable__cell"
           >
             <span style={{ width: '20px' }}>
               <a
                 className="m-datatable__toggle-subtable"
                 href="javascript:void(0)"
                 data-value={i}
                 onClick={() => this.expendRowToggle(url, i)}
                 title="Load sub table"
               >
                 <i className="fa fa-caret-right" id={`icon-${i}`} />
               </a>
             </span>
           </td>
           <td
             data-field="groupName"
             className="m-datatable__cell m-datatable__cell--center"
           >
             <span style={{ width: '150px' }}>{url.name}</span>
           </td>
           <td data-field="baseUrl" className="m-datatable__cell m-datatable__cell--center">
             <span style={{ width: '150px' }}>{url.url}</span>
           </td>
           <td data-field="alternetGroups" className="m-datatable__cell m-datatable__cell--center">
             <span style={{ width: '150px' }}>{url.alternetGroups}</span>
           </td>
           <td data-field="redirectLink" className="m-datatable__cell m-datatable__cell--center">
             <span style={{ width: '150px' }}>{url.redirectUrl}</span>
           </td>
           <td data-field="Actions" className="m-datatable__cell m-datatable__cell--center">
             <span style={{ overflow: "visible", width: '150px' }}>
             {this.props.showRedirectUrl
                 &&
                 <a href='#/'
                     data-placement="bottom"
                     title="Copy Redirect URL"
                     onClick={() => this.props.copyUrl(url)}
                     className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill">
                         <i className="la la-copy" />
                 </a>
             }
               <a
                 href="/#"
                 data-toggle="modal"
                 data-target="#edit"
                 data-placement="bottom"
                 title="Edit url"
                 onClick={() => {this.props.toBeEdit(url)}}
                 className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"
                 title="Edit details"
               >
                 <i className="la la-edit" />
               </a>
               <a
                 href="/#"
                 onClick={() => this.props.toBeDelete(url)}
                 data-toggle="modal"
                 data-target="#delete"
                 data-placement="bottom"
                 title="Delete url"
                 className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
               >
                 <i className="la la-trash" />
               </a>
             </span>
           </td>
         </tr>
         <tr className="m-datatable__row-detail" id={`child-table-${i}`} style={{display: 'none'}}>
           <td className="m-datatable__detail" colSpan={6}>
             <div
               id="child_data_local_1"
               className="m-datatable m-datatable--default m-datatable--brand m-datatable--loaded m-datatable--scroll"
               style={{ position: "static", zoom: 1, width: '100%' }}
             >
             {this.state.alternetUrls.length > 0
               ?  <table
                  className="m-datatable__table"
                  id="m-datatable--1447072851670"
                  style={{ display: "block", maxHeight: '300px' }}
                >
                  <thead className="m-datatable__head">
                    <tr className="m-datatable__row" style={{ height: '51px' }}>
                      <th
                        data-field="name"
                        className="m-datatable__cell--center m-datatable__cell"
                      >
                        <span style={{ width: '200px' }}>Name</span>
                      </th>
                      <th
                        data-field="url"
                        className="m-datatable__cell--center m-datatable__cell"
                      >
                        <span style={{ width: '320px' }}>URL</span>
                      </th>
                      <th
                        data-field="count"
                        className="m-datatable__cell--center m-datatable__cell"
                      >
                        <span style={{ width: '300px' }}>Participent Count</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="m-datatable__body"
                    style={{ maxHeight: '300px', overflow: "auto" }}
                  >
                  {
                    this.state.alternetUrls.map((alternetUrl, a) =>
                    (
                      <tr
                        data-row={a}
                        key={a}
                        className="m-datatable__row m-datatable__row--even"
                        style={{ height: '60px' }}
                      >
                        <td data-field="name" className="m-datatable__cell--center m-datatable__cell">
                          <span style={{ width: '200px' }}>{alternetUrl.name}</span>
                        </td>
                        <td data-field="url" className="m-datatable__cell m-datatable__cell--center">
                          <span style={{ width: '320px' }}>{alternetUrl.url}</span>
                        </td>
                        <td data-field="count" className="m-datatable__cell--center m-datatable__cell">
                          <span style={{ width: '300px' }}>{alternetUrl.count}</span>
                        </td>
                      </tr>
                    )
                  )
                }
                  </tbody>
                </table>
                : <span>No Alternate url</span>
             }

             </div>
           </td>
         </tr>
         </span>
       )
     )
     }
    </tbody>
  </table>
  : <span>No data to display</span>
}

</div>
</div>
: <span>No Data to Display </span>
}
</span>

      )
  }
}

export default Childtable
