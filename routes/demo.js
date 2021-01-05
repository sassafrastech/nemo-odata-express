var express = require('express');
var url = require('url');
var path = require('path');
var router = express.Router();

function fullUrl(req, { subpath, hash }) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: path.join(req.originalUrl, subpath).replace(/\\/g, '/'),
    hash,
  });
}

router.get('/', function(req, res, next) {
  res.set('OData-Version', '4.0');
  res.type('json');
  res.send({
    "@odata.context": fullUrl(req, { subpath: '$metadata' }),
    "value": [
      {
        "name": "Responses: Example",
        "kind": "EntitySet",
        "url": "Responses-00000000-0000-0000-0000-000000000000"
      }
    ]
  });
});

router.get('/([\$])metadata', function(req, res, next) {
  res.type('application/xml');
  res.send(`
<edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
  <edmx:DataServices>
    <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="NEMO">
      <EntityType Name="Custom" OpenType="true"> </EntityType>
      <EntityType Name="Geographic" OpenType="true">
        <Property Name="Latitude" Type="Edm.Decimal" Nullable="true"/>
        <Property Name="Longitude" Type="Edm.Decimal" Nullable="true"/>
        <Property Name="Altitude" Type="Edm.Decimal" Nullable="true"/>
        <Property Name="Accuracy" Type="Edm.Decimal" Nullable="true"/>
      </EntityType>
      <EntityType Name="Response" OpenType="true">
        <Key>
          <PropertyRef Name="ResponseID"/>
        </Key>
        <Property Name="ResponseSubmitDate" Type="Edm.DateTimeOffset" Nullable="true"/>
        <Property Name="ResponseSubmitterName" Type="Edm.String" Nullable="true"/>
        <Property Name="ResponseID" Type="Edm.Guid" Nullable="true"/>
        <Property Name="ResponseShortcode" Type="Edm.String" Nullable="true"/>
        <Property Name="ResponseReviewed" Type="Edm.Boolean" Nullable="true"/>
        <Property Name="FormName" Type="Edm.String" Nullable="true"/>
      </EntityType>
      <EntityType Name="Responses: Example" OpenType="true" BaseType="NEMO.Response">
        <Property Name="TextQ1" Type="Edm.String" Nullable="true"/>
      </EntityType>
      <EntityContainer Name="NEMOService">
        <EntitySet Name="Custom" EntityType="NEMO.Custom"> </EntitySet>
        <EntitySet Name="Geographic" EntityType="NEMO.Geographic"> </EntitySet>
        <EntitySet Name="Response" EntityType="NEMO.Response"> </EntitySet>
        <EntitySet Name="Responses: Example" EntityType="NEMO.Responses: Example"> </EntitySet>
      </EntityContainer>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
  `.trim());
});

router.get('/Responses-00000000-0000-0000-0000-000000000000', function(req, res, next) {
  res.type('json');
  res.send({
    "@odata.context": fullUrl(req, { subpath: '$metadata', hash: '#Responses: Example' }).replace('/Responses-00000000-0000-0000-0000-000000000000', ''),
    "value": [
      {
        "FormName": "Example",
        "ResponseID": "11111111-1111-1111-1111-111111111111",
        "ResponseShortcode": "foo-bar",
        "ResponseSubmitDate": "2020-01-01T12:00:00-05:00",
        "ResponseSubmitterName": "Baz",
        "ResponseReviewed": false,
        "TextQ1": "Foo"
      }
    ]
  });
});

module.exports = router;
