/**
 * This function is executed once the whole page is completely loaded.
 */
window.onload = function() {
  /**
   * Syntactic sugar to use the $ instead of the more verbose document.querySelector
   * Inspired by bling dot js by Paul Irish
   * https://gist.github.com/paulirish/12fb951a8b893a454b32
   */
  window.$ = document.querySelector.bind(document);

  hideAllFieldsByDefault();
  setDefaultValueForSapBapiParams();
};

function hideAllFieldsByDefault() {
  $("#eddQueryFields").style.display = "none";
  $("#sapQueryFields").style.display = "none";
  $("#sapBapiFields").style.display = "none";
  $("#submitButton").style.display = "none";
  $("#farm").style.display = "none";
}

function setDefaultValueForSapBapiParams() {
  $("#sapBapi-sapBapiParams").defaultValue = `{
    "EXPORTS": {},
    "IMPORTS": {},
    "TABLES": {
      "MESSAGES": [],
      "OBJECTLINKS": [],
      "TEXT_LINES": [{
          "TDOBJECT": "KNVV",
          "TDNAME": "000000167110001200",
          "TDID": "0001",
          "TDSPRAS": "EN"
        }
      ]
    },
    "CHANGINGS": {}
  }`;
}

function openQueryURL() {
  const queryTypeSelected = getQueryTypeSelected();
  const queryURL = generateQueryURL(queryTypeSelected);
  window.open(queryURL);
}

function generateQueryURL(queryTypeSelected) {
  switch (queryTypeSelected) {
    case "eddQuery":
      return generateEDDQueryURL();
    case "sapQuery":
      return generateSAPQueryURL();
    case "sapBapi":
      return generateSAPBapiURL();
  }
}

function generateEDDQueryURL() {
  const tables = $("#eddQuery-tables").value;
  const attributes = $("#eddQuery-attributes").value;
  const filter = encodeURIComponent($("#eddQuery-filter").value);
  const maxRecords = $("#eddQuery-maxRecords").value;
  const farm = $("#farmField").value;
  return `${getBaseUrl(farm)}/EddQuery.ashx?debug=yes&TABLES=${tables}&ATTRIBUTES=${attributes}&FILTER=${filter}&MAXRECORDS=${maxRecords}`;
}

function generateSAPQueryURL() {
  const sapConf = $("#sapQuery-sapConf").value;
  const table = $("#sapQuery-table").value;
  const fields = $("#sapQuery-fields").value;
  const options = $("#sapQuery-options").value;
  const rowCount = $("#sapQuery-rowCount").value;
  const farm = $("#farmField").value;
  return `${getBaseUrl(farm)}/SAPQuery.ashx?debug=yes&SAPCONF=${sapConf}&TABLE=${table}&FIELDS=${fields}&OPTIONS=${options}&ROWCOUNT=${rowCount}`;
}

function generateSAPBapiURL() {
  const sapConf = $("#sapBapi-sapConf").value;
  const sapBapiName = $("#sapBapi-sapBapiName").value;
  const sapBapiParams = $("#sapBapi-sapBapiParams").value;
  const farm = $("#farmField").value;
  return `${getBaseUrl(farm)}/SAPCallBapi.ashx?debug=yes&SAPCONF=${sapConf}&SAPBAPINAME=${sapBapiName}&SAPBAPIPARAMS=${sapBapiParams}`;
}

/**
 * na2 is the only farm where the URL isn't prefixed by ondemand
 * So we have for instance: as1.ondemand.esker.com, but only na2.esker.com
 */
function getBaseUrl(farm) {
  const addOnDemand = (farm.toLowerCase() !== "na2");
  return `https://${farm}${addOnDemand ? ".ondemand" : ""}.esker.com/ondemand/webaccess`;
}

function onSelectQueryType() {
  const queryTypeSelected = getQueryTypeSelected();
  displayElemIfConditionFulfilled(
    "#eddQueryFields",
    queryTypeSelected === "eddQuery"
  );
  displayElemIfConditionFulfilled(
    "#sapQueryFields",
    queryTypeSelected === "sapQuery"
  );
  displayElemIfConditionFulfilled(
    "#sapBapiFields",
    queryTypeSelected === "sapBapi"
  );
  displayElemIfConditionFulfilled(
    "#submitButton",
    queryTypeSelected !== "Choose..."
  );
  displayElemIfConditionFulfilled(
    "#farm",
    queryTypeSelected !== "Choose..."
  );
}

function displayElemIfConditionFulfilled(elementSelector, condition) {
  $(elementSelector).style.display = condition ? "" : "none";
}

function getQueryTypeSelected() {
  return $("#queryType").value;
}
