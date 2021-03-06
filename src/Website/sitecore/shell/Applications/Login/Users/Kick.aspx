<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Kick.aspx.cs" Inherits="Sitecore.Shell.Applications.Login.Users.Kick" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register TagPrefix="ComponentArt" Namespace="ComponentArt.Web.UI" Assembly="ComponentArt.Web.UI" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
  <title>Sitecore</title>
  <link href="/sitecore/login/default.css" rel="stylesheet" />
  <link href="grid.css" type="text/css" rel="stylesheet" />    
</head>
<body>
 <form id="LoginForm" runat="server">
   <div id="Body">
      <div id="Banner">
        <div id="BannerPartnerLogo">
          <asp:PlaceHolder ID="PartnerLogo" runat="server" />
        </div>
        
        <img id="BannerLogo" src="/sitecore/login/logo.png" alt="Sitecore Logo" border="0" />
      </div>
      
      <div id="Menu">
        &nbsp;
      </div>

      <div id="SinglePanel">
        <div class="DialogTitle">Choose a user to kick</div>
          
        <div style="width:768px">
        
          <ComponentArt:Grid id="Grid" 
            RunningMode="Client" 
            CssClass="Grid" 
            HeaderCssClass="GridHeader" 
            FooterCssClass="GridFooter"
            PageSize="15" 
            PagerStyle="Slider" 
            PagerTextCssClass="GridFooterText"
    	      PagerButtonWidth="41"
    	      PagerButtonHeight="22"
    	      SliderHeight="20"
            SliderWidth="150" 
            SliderGripWidth="9" 
            SliderPopupOffsetX="20"
            SliderPopupClientTemplateId="SliderTemplate" 
            PreExpandOnGroup="true"
            ImagesBaseUrl="/sitecore/shell/themes/standard/componentart/grid/" 
            PagerImagesFolderUrl="/sitecore/shell/themes/standard/componentart/grid/pager/"
            TreeLineImagesFolderUrl="/sitecore/shell/themes/standard/componentart/grid/lines/" 
            TreeLineImageWidth="22" 
            TreeLineImageHeight="19" 
            Width="100%" Height="280" runat="server">
            <Levels>
              <ComponentArt:GridLevel
                DataKeyField="sessionid"
                ShowTableHeading="false" 
                ShowSelectorCells="false" 
                HeadingCellCssClass="HeadingCell" 
                HeadingRowCssClass="HeadingRow" 
                HeadingTextCssClass="HeadingCellText"
                DataCellCssClass="DataCell" 
                RowCssClass="Row" 
                SelectedRowCssClass="SelectedRow"
                GroupHeadingCssClass="GroupHeading" 
                SortAscendingImageUrl="asc.gif" 
                SortDescendingImageUrl="desc.gif" >
                <Columns>
                  <ComponentArt:GridColumn DataField="sessionid" Visible="false" />
                  <ComponentArt:GridColumn DataField="icon" Visible="false" />
                  <ComponentArt:GridColumn DataField="name" HeadingText="User" DataCellClientTemplateId="NameTemplate" HeadingCellCssClass="FirstHeadingCell" DataCellCssClass="FirstDataCell" />
                  <ComponentArt:GridColumn DataField="login" HeadingText="Login" FormatString="MMM dd yyyy, hh:mm tt" />
                  <ComponentArt:GridColumn DataField="lastrequest" HeadingText="Last Request" FormatString="MMM dd yyyy, hh:mm tt" />
                </Columns>
              </ComponentArt:GridLevel>
            </Levels>
            <ClientTemplates>
              <ComponentArt:ClientTemplate Id="NameTemplate">
                <img src="## DataItem.GetMember('icon').Value ##" width="16" height="16" border="0" style="margin:0px 4px 0px 0px"  align="absmiddle"/>           
                ## DataItem.GetMember('name').Value ##
              </ComponentArt:ClientTemplate>

              <ComponentArt:ClientTemplate Id="SliderTemplate">
                <table class="SliderPopup" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td valign="top" style="padding:5px;font:8pt tahoma">
                      <img src="## DataItem.GetMember('icon').Value ##" width="16" height="16" style="margin:0px 4px 0px 0px" align="absmiddle" />## DataItem.GetMember('name').Value ##
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="height:14px;background-color:#757598;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-left:5px;color:white;font:8pt tahoma">
                        Page <b>## DataItem.PageIndex + 1 ##</b> of <b>## Grid.PageCount ##</b>
                        </td>
                        <td style="padding-right:5px;color:white;font:8pt tahoma" align="right">
                        User <b>## DataItem.Index + 1 ##</b> of <b>## Grid.RecordCount ##</b>
                        </td>
                      </tr>
                      </table>  
                    </td>
                  </tr>
                </table>
              </ComponentArt:ClientTemplate>
            </ClientTemplates>
          </ComponentArt:Grid>
          
        </div>
        
        <div id="DialogButtons">
          <button id="Kick" name="Kick" type="submit">Kick</button>
          <button id="Cancel" name="Cancel" type="submit">Cancel</button>
        </div>
        
      </div>
    </div>
  </form>
</body>
</html>

