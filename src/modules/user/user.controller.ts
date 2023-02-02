import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {User} from "entities/user.entity";
import {isFileExtensionSafe, removeFile, saveImageToStorage} from "helpers/imageStorage";
import {join} from "path";

import {GetCurrentUserId} from "../../decorators/get-current-user-id.decorator";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdatePasswordDto} from "./dto/update-password.dto";
import {UserService} from "./user.service";

@Controller("me")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
	constructor(private readonly usersService: UserService) {}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOne(@Param("id") id: string): Promise<User> {
		return this.usersService.findById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto);
	}

	@Post("upload/:id")
	@UseInterceptors(FileInterceptor("avatar", saveImageToStorage))
	@HttpCode(HttpStatus.CREATED)
	async upload(@UploadedFile() file: Express.Multer.File, @Param("id") id: string): Promise<User> {
		const filename = file?.filename;

		if (!filename) throw new BadRequestException("File must be a png, jpg/jpeg");

		const imagesFolderPath = join(process.cwd(), "files");
		const fullImagePath = join(imagesFolderPath + "/" + file.filename);
		if (await isFileExtensionSafe(fullImagePath)) {
			return this.usersService.updateUserImageId(id, filename);
		}
		removeFile(fullImagePath);
		throw new BadRequestException("File content does not match extension!");
	}

	@Patch("update-password")
	@HttpCode(HttpStatus.OK)
	async update(@Body() updatePasswordDto: UpdatePasswordDto, @GetCurrentUserId() userId: string): Promise<User> {
		return this.usersService.updatePassword(userId, updatePasswordDto);
	}
}
