
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
			var netPair = this.deformationNetPair;
			var netBefore = netPair.netBeforeDeformation;
			var netAfter = netPair.netAfterDeformation;

			var canvasToDeform = this.imageToDeform.toCanvas();
			var graphicsBefore = canvasToDeform.getContext("2d");

			var canvasDeformed = document.createElement("canvas");
			canvasDeformed.width = canvasToDeform.width;
			canvasDeformed.height = canvasToDeform.height;
			var graphicsAfter = canvasDeformed.getContext("2d");

			var imageSize = this.imageToDeform.size();

			var pixelPosBefore = new Coords();
			var pixelPosAfter = new Coords();
			var pixelPosRelativeToNodeBefore = new Coords();
			var displacement = new Coords();

			for (var y = 0; y < imageSize.y; y++)
			{
				pixelPosBefore.y = y;

				for (var x = 0; x < imageSize.x; x++)
				{
					pixelPosBefore.x = x;

					var pixelBeforeAsImageData = graphicsBefore.getImageData
					(
						pixelPosBefore.x, pixelPosBefore.y,
						1, 1
					);

					var pixelBeforeAsComponentsRGBA =
						pixelBeforeAsImageData.data;

					var pixelColor =
						"rgba(" + pixelBeforeAsComponentsRGBA.join(",") + ")";

					// Find the nearest before node.
					var nodeIndex =
						netBefore.nodeNearestPosGetIndex(pixelPosBefore);

					var nodeBefore = netBefore.nodeAtIndex(nodeIndex);
					var nodeAfter = netAfter.nodeAtIndex(nodeIndex);

					var nodeBeforeDisplacementsToNeighbors =
						nodeBefore.neighborDisplacements;

					pixelPosRelativeToNodeBefore
						.overwriteWith(pixelPosBefore)
						.subtract(nodeBefore.pos);

					var pixelFractionsOfDistanceTowardNeighbors =
					[
						displacement
							.overwriteWith(nodeBeforeDisplacementsToNeighbors[0])
							.normalize()
							.dotProduct(pixelPosRelativeToNodeBefore)
							/ nodeBeforeDisplacementsToNeighbors[0].magnitude(),

						displacement
							.overwriteWith(nodeBeforeDisplacementsToNeighbors[1])
							.normalize()
							.dotProduct(pixelPosRelativeToNodeBefore)
							/ nodeBeforeDisplacementsToNeighbors[1].magnitude()
					];

					var nodeAfterDisplacementsToNeighbors =
						nodeAfter.neighborDisplacements;

					pixelPosAfter
						.overwriteWith(nodeAfter.pos)
						.add
						(
							displacement
								.overwriteWith(nodeAfterDisplacementsToNeighbors[0])
								.multiplyScalar(pixelFractionsOfDistanceTowardNeighbors[0])
						)
						.add
						(
							displacement
								.overwriteWith(nodeAfterDisplacementsToNeighbors[1])
								.multiplyScalar(pixelFractionsOfDistanceTowardNeighbors[1])
						);

					graphicsAfter.fillStyle = pixelColor;
					graphicsAfter.fillRect(pixelPosAfter.x, pixelPosAfter.y, 1, 1);
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
