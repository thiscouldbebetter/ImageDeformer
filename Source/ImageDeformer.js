
class ImageDeformer
{
	constructor
	(
		imageToDeform,
		deformationNetPair,
		samplesToTakePerLinearPixel
	)
	{
		this.imageToDeform = imageToDeform;
		this.deformationNetPair = deformationNetPair;
		this.samplesToTakePerLinearPixel =
			samplesToTakePerLinearPixel || 1;

		this.imageDeformed = null;
	}

	static create()
	{
		return new ImageDeformer(null, null, null);
	}

	static Instance()
	{
		if (ImageDeformer._instance == null)
		{
			ImageDeformer._instance = ImageDeformer.create();
		}
		return ImageDeformer._instance;
	}

	deform()
	{
		if (this.imageToDeform != null)
		{
			var canvasToDeform = this.imageToDeform.toCanvas();
			var graphicsBefore = canvasToDeform.getContext("2d");

			var canvasDeformed = document.createElement("canvas");
			canvasDeformed.width = canvasToDeform.width;
			canvasDeformed.height = canvasToDeform.height;
			var graphicsAfter = canvasDeformed.getContext("2d");

			var imageSize = this.imageToDeform.size();

			var pixelPos = new Coords();

			for (var y = 0; y < imageSize.y; y++)
			{
				pixelPos.y = y;

				for (var x = 0; x < imageSize.x; x++)
				{
					pixelPos.x = x;

					var pixelAsImageData =
						graphicsBefore.getImageData(pixelPos.x, pixelPos.y, 1, 1);
					var pixelAsComponents = pixelAsImageData.data;
					var pixelColor =
						"rgba(" + pixelAsComponents.join(",") + ")";

					graphicsAfter.fillStyle = pixelColor;
					graphicsAfter.fillRect(pixelPos.x, pixelPos.y, 1, 1);
				}
			}
		}

		this.imageDeformed = new ImageFromCanvas(canvasDeformed);
	}

	initializeFromImgElement(imageToDeformAsImgElement)
	{
		this.imageToDeform =
			new ImageFromImgElement(imageToDeformAsImgElement);

		var imageSize = this.imageToDeform.size();

		this.deformationNetPair =
			DeformationNetPair.fromSize(imageSize);
	}

	// DOM.

	domElementUpdate()
	{
		var d = document;

		var canvas = this.imageToDeform.toCanvas();
		this.imageToDeformAsDomElement = canvas;

		var divImageToDeform =
			d.getElementById("divImageToDeform");
		divImageToDeform.innerHTML = "";
		divImageToDeform.appendChild(this.imageToDeformAsDomElement);

		var imageToDeformAsGraphicsContext =
			canvas.getContext("2d");

		this.deformationNetPair.drawToGraphicsContext
		(
			imageToDeformAsGraphicsContext
		);

		if (this.imageDeformed != null)
		{
			var imageDeformedAsCanvas = this.imageDeformed.toCanvas();

			var divImageDeformed =
				d.getElementById("divImageDeformed");
			divImageDeformed.innerHTML = "";
			divImageDeformed.appendChild(imageDeformedAsCanvas);
		}
	}
}
