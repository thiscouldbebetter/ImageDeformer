
class ImageFromImgElement
{
	constructor(imageAsImgElement)
	{
		this.imageAsImgElement = imageAsImgElement;
	}

	static fromWidthAndHeight(width, height)
	{
		var d = document;

		var imageAsImgElement =
			d.createElement("img");
		imageAsCanvas.width = width;
		imageAsCanvas.height = height;

		return new ImageFromImgElement(imgAsImgElement);
	}

	clone()
	{
		var d = document;

		var imgElementCloned = d.createElement("img");
		imgElementCloned.src = this.imageAsImgElement.src;

		var returnImage = new ImageFromImgElement(imgElementCloned);

		return returnImage;
	}

	size()
	{
		if (this._size == null)
		{
			this._size = new Coords
			(
				this.imageAsImgElement.width,
				this.imageAsImgElement.height
			);
		}
		return this._size;
	}

	toCanvas()
	{
		var d = document;

		var imageAsCanvas =
			d.createElement("canvas");
		imageAsCanvas.width =
			this.imageAsImgElement.width;
		imageAsCanvas.height =
			this.imageAsImgElement.height;

		var graphicsContext = imageAsCanvas.getContext("2d");

		graphicsContext.drawImage(this.imageAsImgElement, 0, 0);

		return imageAsCanvas;
	}
}
