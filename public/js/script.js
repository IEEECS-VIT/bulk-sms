var uname=1;
var pwd=1;

$(document).ready(function()
{
  $('#add').click(function()
  {
      $('.credential-holder').append("<div class='row' class='credentials'>\
        <div class='col-md-6 col-xs-6'>\
          <div class='form-group'>\
            <label for='usr'>Username</label>\
            <input type='number' class='form-control' max='9999999999' id='uname-"+uname+"'>\
          </div>\
        </div>\
        <div class='col-md-6 col-xs-6'>\
          <div class='form-group'>\
            <label for='pwd'>Password</label>\
            <input type='password' class='form-control' id='pwd-"+pwd+"'>\
          </div>\
        </div>\
      </div>\
      ");
      uname+=1;
      pwd+=1;
  });
  $("#sub").click(function()
  {
    if(uname>1)
    {
      $("#uname-"+(uname-1)).parent().parent().parent().remove()
      uname-=1;
      pwd-=1;
    }
  });
});

function submit()
{
  var user_list=[]; //List of Users
  var pwd_list=[];  //List of pwd
  for(var i=0;i<uname;i++)
  {
    var U=$("#uname-"+i).val();
    user_list.push(U);
    var P=$("#pwd-"+i).val();
    pwd_list.push(P);
  }

  var msg=$("#message").val(); //Message
  var recpt_list=[]; //List of recipients
  var recpt=$('#recipients').val().replace(/\s/g, ''); // Trim string
  recpt_list=recpt.split(',');

  if(!validate(user_list, pwd_list, recpt_list))
  {
    return 0;
  }
  //Algo Begins!
  var ratio=Math.floor(recpt_list.length/user_list.length);
  var users=user_list.length; //No. of users
  var recpts=recpt_list.length; //No. of Recipients
  if(ratio<1)
  {
    user_list=user_list.slice(0,recpts);
    pwd_list=pwd_list.slice(0,recpts);
    ratio=1;
  }
  var sent=0;
  var complete;
  alert("Bulk SMS job initiated ");
  for(i=0;sent+ratio<recpts;i = (i+1) % users)
  {
    var data={"username":user_list[i],"password":pwd_list[i],"mobile":recpt_list.slice(sent,sent+ratio),"message":msg}
    ajax(data);
    sent=sent+ratio
  }
  if(sent<recpts)
  {
    var data={"username":user_list[0],"password":pwd_list[0],"mobile":recpt_list.slice(sent,recpts),"message":msg}
    ajax(data);
  }
}

function ajax(data)
{

  data=JSON.stringify(data);
  console.log('Sending AJAX');

  var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://way2smsapi.herokuapp.com/send",
  "method": "POST",
  "headers": {
    "content-type": "application/json",
  },
  "processData": false,
  "data": data
}

$.ajax(settings).done(function (response) {
  var res=jQuery.parseJSON(response);
  console.log(response);
  if(res.code==100)
  {
    alert("Credentials of USERNAME: '"+jQuery.parseJSON(data).username+"' do not match");
  }
});

}

function validate(U,P,R)
{
  for(var i in U)
  {
    if(U[i].length==0)
    {
      alert("USERNAME cannot be empty");
      return false;
    }
    if(P[i].length==0)
    {
      alert("PASSWORD cannot be empty");
      return false;
    }
    if(U[i].length!=10)
    {
      alert("USERNAME:'"+U[i]+"'is not 10 digit");
      return false;
    }
  }

  for(i in R)
  {
    if(isNaN(parseInt(R[i])))
    {
      alert("RECIPIENT NUMBER:'"+R[i]+"'is invalid");
    }
    if(R[i].length!=10)
    {
      alert("RECIPIENT NUMBER:'"+R[i]+"'is not 10 digit");
      return false;
    }
  }
  return true;
}
