const emailHeader = (body) => {
  return {
    to: ''+body.email,
    from: 'support@cloudkibo.com',
    subject: 'Welcome to WLB',
    text: 'Welcome to WLB'
  }
}

const setEmailBody = (tokenString, body) => {
  let email = '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
  '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
  '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
  '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
  '<p style="color: #ffffff">Welcome</p> </td></tr> </table> </td> </tr> </table> ' +
  '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
  '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
  '<tr> <td class="wrapper last"> <p> Hello ' + body.firstname +' '+ body.lastname + ',<br> Thank you for joining WLB. We are so happy to have you on board.</p> <p>You can now start using WLB <br><br> <a href="https://swlb.cloudkibo.com/">Get Started</a></p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
  '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="#"> ' +
  '</a> </td> <td class="expander"> </td> </tr> </table> <p>If you need any help in understanding WLB follow this <a href="https://kibopush.com/wlb/">Guide!</a></p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
  '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>'
  return email
}

exports.emailHeader = emailHeader
exports.setEmailBody = setEmailBody
