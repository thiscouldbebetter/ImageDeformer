
class UiEventHandler
{
	static buttonDeform_Clicked()
	{
		var imageDeformer = ImageDeformer.Instance();

		imageDeformer.deform();

		imageDeformer.domElementUpdate();
	}

	static buttonNodeSelect_SelectByOffset(offset)
	{
		var imageDeformer = ImageDeformer.Instance();
		var netPair = imageDeformer.deformationNetPair;
		var netSelected = netPair.netSelected();
		netSelected.nodeSelectByOffset(offset);
		imageDeformer.domElementUpdate();
	}

	static buttonNodeSelectDown_Clicked()
	{
		UiEventHandler.buttonNodeSelect_SelectByOffset(new Coords(0, 1) );
	}

	static buttonNodeSelectLeft_Clicked()
	{
		UiEventHandler.buttonNodeSelect_SelectByOffset(new Coords(-1, 0) );
	}

	static buttonNodeSelectRight_Clicked()
	{
		UiEventHandler.buttonNodeSelect_SelectByOffset(new Coords(1, 0) );
	}

	static buttonNodeSelectUp_Clicked()
	{
		UiEventHandler.buttonNodeSelect_SelectByOffset(new Coords(0, -1) );
	}

	static buttonNodeSelectedMove_MoveByOffset(offset)
	{
		var imageDeformer = ImageDeformer.Instance();
		var netPair = imageDeformer.deformationNetPair;
		var netSelected = netPair.netSelected();
		var nodeSelectedPos = netSelected.nodeSelectedPosition();
		nodeSelectedPos.add(offset);
		imageDeformer.domElementUpdate();
	}

	static buttonNodeSelectedMoveDown_Clicked()
	{
		UiEventHandler.buttonNodeSelectedMove_MoveByOffset(new Coords(0, 1) );
	}

	static buttonNodeSelectedMoveLeft_Clicked()
	{
		UiEventHandler.buttonNodeSelectedMove_MoveByOffset(new Coords(-1, 0) );
	}

	static buttonNodeSelectedMoveRight_Clicked()
	{
		UiEventHandler.buttonNodeSelectedMove_MoveByOffset(new Coords(1, 0) );
	}

	static buttonNodeSelectedMoveUp_Clicked()
	{
		UiEventHandler.buttonNodeSelectedMove_MoveByOffset(new Coords(0, -1) );
	}

	static inputImageFile_Changed(inputImageFile)
	{
		var file = inputImageFile.files[0];
		if (file != null)
		{
			var fileReader = new FileReader();
			fileReader.onload = (event) =>
			{
				var imageAsDataUrl = event.target.result;

				var d = document;

				var imageAsImg = d.createElement("img");
				imageAsImg.onload = (event2) =>
				{
					var imageDeformer = ImageDeformer.Instance();
					imageDeformer.initializeFromImgElement
					(
						imageAsImg
					);
					imageDeformer.domElementUpdate();
				}
				imageAsImg.src = imageAsDataUrl;
			}
			fileReader.readAsDataURL(file);
		}
	}

	static selectNetSelectedName_Changed(selectNetSelectedName)
	{
		var netToSelectName = selectNetSelectedName.value;
		var imageDeformer = ImageDeformer.Instance();
		var netPair = imageDeformer.deformationNetPair;
		netPair.netSelectByName(netToSelectName);
		imageDeformer.domElementUpdate();
	}

}
