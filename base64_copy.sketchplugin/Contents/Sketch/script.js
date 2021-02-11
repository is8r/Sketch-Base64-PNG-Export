          var onRun = function(context) {
          
var doc = context.document;
var selectedLayers = context.selection;
var selectedCount = selectedLayers.count();
var firstLayer = selectedLayers.firstObject();
var scriptPath = context.scriptPath;
var directory = [scriptPath stringByDeletingLastPathComponent] + "/";

if (selectedCount == 0) {
  log('No layer selected');
  return;
}

log(selectedCount+' layer selected');
data = exportFile(firstLayer);

function exportFile(layer){
  let MSImmutableLayerAncestry = NSClassFromString("SketchModel.MSImmutableLayerAncestry")
  let ancestry = MSImmutableLayerAncestry.alloc().initWithMutableLayer(layer)
  let MSSliceTrimming = NSClassFromString("MSSliceTrimming")
  let rect = MSSliceTrimming.trimmedRectForLayerAncestry(ancestry);

  let slice = MSExportRequest.exportRequestsFromExportableLayer(layer).firstObject();
  slice.scale = 2;

  var fileDisplayName = [doc displayName];
  var fileFolder = NSTemporaryDirectory();
  var fileName = "JamesBase64";
  var fullPath = fileFolder + fileName + ".png";

  [doc saveArtboardOrSlice:slice toFile:fullPath];

  var url = [NSURL fileURLWithPath:fullPath];
  var data = [[NSData alloc]initWithContentsOfURL: url];
  var base64 = [data base64EncodedStringWithOptions:0];

  //log(base64)

  clearFile(url);
  returnSCSS(base64, layer);
}

    function returnSCSS(base64, layer){
        showMessage("base64 data url already copied to clipboard, click cmd⌘ + v to paste it.");
        var output = "$map-svg-" +layer.name()+ ": (width: " +layer.frame().width()+ "px, height: " +layer.frame().height()+ "px, base64: '" +base64+ "');";
  log(output)
        return copy_text(output);
    }

    function showMessage(text){
        [doc showMessage:text];
    }

    function clearFile(url){
        [[NSFileManager defaultManager] removeItemAtURL:url error:nil];
    }

    function copy_text(txt){
      var pasteBoard = [NSPasteboard generalPasteboard]
      [pasteBoard declareTypes:[NSArray arrayWithObject:NSPasteboardTypeString] owner:nil]
      [pasteBoard setString:txt forType:NSPasteboardTypeString]
    }

          };
          